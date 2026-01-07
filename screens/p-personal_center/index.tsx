

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import { logoutUser } from '../../services/auth';
import DonationModal from '../../components/DonationModal';

interface UserData {
  nickname: string;
  avatar: string;
  joinDays: number;
  collectionsCount: number;
  browseCount: number;
  joinDateStr: string;
  lastActiveStr: string;
}

const PersonalCenterScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isDonateModalVisible, setIsDonateModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('@userProfile');
      let parsedProfile: any = {};

      if (savedProfile) {
        parsedProfile = JSON.parse(savedProfile);
      } else {
        // 如果没有用户信息，跳转登录（双重保险，通常会被Layout拦截）
        return;
      }

      // 获取浏览历史和收藏数量
      const historyJson = await AsyncStorage.getItem('@browseHistory');
      const bookmarksJson = await AsyncStorage.getItem('@bookmarked_projects');
      
      // 计算加入天数和日期字符串
      let joinTimestamp = Date.now();
      let joinDateStr = '';
      
      if (parsedProfile.joinDate) {
        const date = new Date(parsedProfile.joinDate);
        joinTimestamp = date.getTime();
        joinDateStr = date.toLocaleDateString();
      } else {
        // Fallback: use local storage logic
        let registrationDate = await AsyncStorage.getItem('@registrationDate');
        if (!registrationDate) {
          registrationDate = Date.now().toString();
          await AsyncStorage.setItem('@registrationDate', registrationDate);
        }
        joinTimestamp = parseInt(registrationDate, 10);
        joinDateStr = new Date(joinTimestamp).toLocaleDateString();
      }

      const currentTimestamp = Date.now();
      const diffTime = Math.abs(currentTimestamp - joinTimestamp);
      const joinDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      const lastActiveStr = parsedProfile.lastActive 
        ? new Date(parsedProfile.lastActive).toLocaleDateString()
        : new Date().toLocaleDateString();

      const historyCount = historyJson ? JSON.parse(historyJson).length : 0;
      const bookmarksCount = bookmarksJson ? JSON.parse(bookmarksJson).length : 0;

      const newUserData: UserData = {
        nickname: parsedProfile.nickname || '',
        avatar: parsedProfile.avatar || '',
        joinDays: joinDays,
        browseCount: historyCount,
        collectionsCount: bookmarksCount,
        joinDateStr: joinDateStr,
        lastActiveStr: lastActiveStr,
      };

      setUserData(newUserData);
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  };

  const handleSettingsPress = () => {
    router.push('/p-settings');
  };

  const handleEditProfilePress = () => {
    router.push('/p-edit_profile');
  };

  const handleMyCollectionsPress = () => {
    router.push('/p-my_collections');
  };

  const handleBrowseHistoryPress = () => {
    router.push('/p-browse_history');
  };

  const handleInterestSettingsPress = () => {
    router.push('/p-interest_settings');
  };

  const handleAccountSecurityPress = () => {
    router.push('/p-account_security');
  };

  const handleHelpFeedbackPress = () => {
    router.push('/p-help_feedback');
  };

  const handleAboutAppPress = () => {
    router.push('/p-about_app');
  };

  const handleDonatePress = () => {
    setIsDonateModalVisible(true);
  };

  const handleLogoutPress = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            router.replace('/p-login_register');
          },
        },
      ]
    );
  };

  const handleAvatarUploadPress = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要访问相册权限来更换头像');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsAvatarUploading(true);
        
        // 模拟上传延迟
        setTimeout(async () => {
          try {
            await AsyncStorage.setItem('@userAvatar', result.assets[0].uri);
            setUserData(prev => {
              if (!prev) return null;
              return { ...prev, avatar: result.assets[0].uri };
            });
            Alert.alert('成功', '头像上传成功');
          } catch (error) {
            Alert.alert('错误', '头像上传失败，请重试');
          } finally {
            setIsAvatarUploading(false);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('头像上传失败:', error);
      Alert.alert('错误', '头像上传失败，请重试');
    }
  };

  const renderStatCard = (
    value: number,
    label: string,
    gradientColors: [string, string, ...string[]]
  ) => (
    <View style={styles.statCardContainer}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statCard}
      >
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </LinearGradient>
    </View>
  );

  const renderMenuItem = (
    icon: string,
    iconColor: string,
    iconBgColor: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    badge?: number
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, { backgroundColor: iconBgColor }]}>
          <FontAwesome6 name={icon} size={16} color={iconColor} />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {badge !== undefined && (
          <Text style={styles.menuBadge}>{badge}</Text>
        )}
        <FontAwesome6 name="chevron-right" size={12} color="#6b7280" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>个人中心</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="gear" size={14} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {userData ? (
          <>
            {/* 用户信息区域 */}
            <View style={styles.userInfoSection}>
              <View style={styles.userInfoHeader}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={['#2563eb', '#10b981']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarRing}
                  >
                    <Image source={{ uri: userData!.avatar }} style={styles.avatar} />
                    <TouchableOpacity
                      style={styles.avatarUploadOverlay}
                      onPress={handleAvatarUploadPress}
                      activeOpacity={0.7}
                      disabled={isAvatarUploading}
                    >
                      <FontAwesome6
                        name={isAvatarUploading ? 'spinner' : 'camera'}
                        size={12}
                        color="#2563eb"
                      />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
                <View style={styles.userInfoText}>
                  <Text style={styles.userNickname}>{userData!.nickname}</Text>
                </View>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handleEditProfilePress}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="pen" size={12} color="#ffffff" />
              <Text style={styles.editProfileButtonText}>编辑</Text>
            </TouchableOpacity>
          </View>

          {/* 统计数据 */}
          <View style={styles.statsContainer}>
            {renderStatCard(userData!.collectionsCount, '收藏', ['#667eea', '#764ba2'])}
            {renderStatCard(userData!.browseCount, '浏览', ['#f093fb', '#f5576c'])}
            {renderStatCard(userData!.joinDays, '天数', ['#4facfe', '#00f2fe'])}
          </View>
        </View>

        {/* 功能菜单 */}
        <View style={styles.menuSection}>
          {/* 我的内容 */}
          <View style={styles.menuGroup}>
            <Text style={styles.menuGroupTitle}>我的内容</Text>
            <View style={styles.menuItemsContainer}>
              {renderMenuItem(
                'heart',
                '#ef4444',
                '#fef2f2',
                '我的收藏',
                '查看收藏的项目',
                handleMyCollectionsPress,
                userData!.collectionsCount
              )}
              {renderMenuItem(
                'clock-rotate-left',
                '#3b82f6',
                '#eff6ff',
                '浏览历史',
                '查看浏览记录',
                handleBrowseHistoryPress,
                userData!.browseCount
              )}
            </View>
          </View>

          {/* 设置 */}
          <View style={styles.menuGroup}>
            <Text style={styles.menuGroupTitle}>设置</Text>
            <View style={styles.menuItemsContainer}>
              {renderMenuItem(
                'sliders',
                '#10b981',
                '#f0fdf4',
                '兴趣设置',
                '个性化推荐设置',
                handleInterestSettingsPress
              )}
              {renderMenuItem(
                'shield-halved',
                '#8b5cf6',
                '#faf5ff',
                '账户安全',
                '密码、绑定等',
                handleAccountSecurityPress
              )}
            </View>
          </View>

          {/* 其他 */}
          <View style={styles.menuGroup}>
            <Text style={styles.menuGroupTitle}>其他</Text>
            <View style={styles.menuItemsContainer}>
              {renderMenuItem(
                'mug-hot',
                '#ec4899',
                '#fce7f3',
                '支持我们',
                '请作者喝杯咖啡',
                handleDonatePress
              )}
              {renderMenuItem(
                'circle-question',
                '#f59e0b',
                '#fffbeb',
                '帮助与反馈',
                '使用帮助和问题反馈',
                handleHelpFeedbackPress
              )}
              {renderMenuItem(
                'circle-info',
                '#6b7280',
                '#f9fafb',
                '关于码潮',
                '版本信息和使用协议',
                handleAboutAppPress
              )}
            </View>
          </View>
        </View>

        {/* 退出登录 */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
            activeOpacity={0.8}
          >
            <FontAwesome6 name="right-from-bracket" size={14} color="#ef4444" />
            <Text style={styles.logoutButtonText}>退出登录</Text>
          </TouchableOpacity>
        </View>
        </>
      ) : (
        <View style={{ padding: 20, alignItems: 'center', marginTop: 50 }}>
          <Text>正在加载用户信息...</Text>
        </View>
      )}
      </ScrollView>

      <DonationModal
        visible={isDonateModalVisible}
        onClose={() => setIsDonateModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default PersonalCenterScreen;

