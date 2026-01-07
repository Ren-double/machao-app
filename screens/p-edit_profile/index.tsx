

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

interface ProfileData {
  nickname: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
  joinDateStr?: string;
  lastActiveStr?: string;
}

const EditProfileScreen = () => {
  const router = useRouter();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    nickname: '',
    bio: '',
    location: '',
    website: '',
    avatar: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [bioCharacterCount, setBioCharacterCount] = useState(0);
  
  const bioInputRef = useRef<TextInput>(null);

  React.useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('@userProfile');
      let extraData: Partial<ProfileData> = {};

      // Load join date and last active
      let joinDateStr = '';
      let lastActiveStr = '';

      if (savedProfile) {
         const p = JSON.parse(savedProfile);
         if (p.joinDate) joinDateStr = new Date(p.joinDate).toLocaleString();
         if (p.lastActive) lastActiveStr = new Date(p.lastActive).toLocaleString();
      }

      if (!joinDateStr) {
          const regDate = await AsyncStorage.getItem('@registrationDate');
          if (regDate) joinDateStr = new Date(parseInt(regDate, 10)).toLocaleString();
      }

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData({
            ...parsedProfile,
            joinDateStr: joinDateStr || '未知',
            lastActiveStr: lastActiveStr || '刚刚'
        });
        if (parsedProfile.bio) {
          setBioCharacterCount(parsedProfile.bio.length);
        }
      } else {
        // 尝试单独读取头像（兼容旧逻辑）
        const savedAvatar = await AsyncStorage.getItem('@userAvatar');
        if (savedAvatar) {
          setProfileData(prev => ({ ...prev, avatar: savedAvatar }));
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleSavePress = async () => {
    setIsSaving(true);
    
    try {
      // 模拟保存操作延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存完整个人资料到本地存储
      await AsyncStorage.setItem('@userProfile', JSON.stringify(profileData));
      
      // 同时更新单独的头像存储（保持兼容性）
      if (profileData.avatar) {
        await AsyncStorage.setItem('@userAvatar', profileData.avatar);
      }
      
      Alert.alert('成功', '个人资料已成功保存', [
        {
          text: '确定',
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelPress = () => {
    Alert.alert(
      '确认取消',
      '确定要取消编辑吗？所有未保存的更改将会丢失。',
      [
        { text: '继续编辑', style: 'cancel' },
        {
          text: '确定取消',
          style: 'destructive',
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleChangeAvatarPress = async () => {
    try {
      // 请求媒体库权限
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要访问相册权限来更换头像');
        return;
      }

      // 打开图片选择器
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // 检查文件大小（5MB限制）
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          Alert.alert('文件过大', '文件大小不能超过5MB');
          return;
        }

        setProfileData(prev => ({
          ...prev,
          avatar: asset.uri,
        }));
        
        Alert.alert('成功', '头像上传成功');
      }
    } catch (error) {
      Alert.alert('错误', '头像上传失败，请重试');
    }
  };

  const handleNicknameChange = (text: string) => {
    setProfileData(prev => ({ ...prev, nickname: text }));
  };

  const handleBioChange = (text: string) => {
    if (text.length <= 200) {
      setProfileData(prev => ({ ...prev, bio: text }));
      setBioCharacterCount(text.length);
    }
  };

  const handleLocationChange = (text: string) => {
    setProfileData(prev => ({ ...prev, location: text }));
  };

  const handleWebsiteChange = (text: string) => {
    setProfileData(prev => ({ ...prev, website: text }));
  };

  const renderFloatingLabel = (
    label: string,
    value: string,
    isFocused: boolean,
    style?: any
  ) => {
    const isFilled = value.trim() !== '';
    const shouldFloat = isFilled || isFocused;

    return (
      <Text
        style={[
          styles.floatingLabel,
          shouldFloat && styles.floatingLabelActive,
          style,
        ]}
      >
        {label}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 顶部导航栏 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="chevron-left" size={18} color="#1e293b" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>编辑个人资料</Text>
          
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSavePress}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <View style={styles.saveButtonContent}>
                <FontAwesome6 name="spinner" size={14} color="#ffffff" />
                <Text style={styles.saveButtonText}>保存中...</Text>
              </View>
            ) : (
              <Text style={styles.saveButtonText}>保存</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 主要内容区域 */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 头像设置 */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
              <View style={styles.avatarOverlay}>
                <FontAwesome6 name="camera" size={20} color="#ffffff" />
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.changeAvatarButton}
              onPress={handleChangeAvatarPress}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="camera" size={14} color="#64748b" />
              <Text style={styles.changeAvatarButtonText}>更换头像</Text>
            </TouchableOpacity>
            
            <Text style={styles.avatarHint}>
              支持 JPG、PNG 格式，文件大小不超过 5MB
            </Text>
          </View>

          {/* 个人信息表单 */}
          <View style={styles.formSection}>
            {/* 昵称输入框 */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={profileData.nickname}
                  onChangeText={handleNicknameChange}
                  placeholder="昵称"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            {/* 个人简介输入框 */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={bioInputRef}
                  style={[styles.textInput, styles.bioInput]}
                  value={profileData.bio}
                  onChangeText={handleBioChange}
                  placeholder="个人简介"
                  placeholderTextColor="#64748b"
                  multiline
                  textAlignVertical="top"
                />
                <View style={styles.characterCounter}>
                  <Text
                    style={[
                      styles.characterCountText,
                      bioCharacterCount > 200 && styles.characterCountError,
                    ]}
                  >
                    {bioCharacterCount}/200
                  </Text>
                </View>
              </View>
            </View>

            {/* 附加信息 (只读) */}
            <View style={{ marginTop: 24, padding: 16, backgroundColor: '#f8fafc', borderRadius: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#334155', marginBottom: 12 }}>账号信息</Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#64748b' }}>注册时间</Text>
                    <Text style={{ color: '#334155', fontWeight: '500' }}>{profileData.joinDateStr}</Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#64748b' }}>上次活跃</Text>
                    <Text style={{ color: '#334155', fontWeight: '500' }}>{profileData.lastActiveStr}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#64748b' }}>账号状态</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 6 }} />
                        <Text style={{ color: '#10b981', fontWeight: '500' }}>正常</Text>
                    </View>
                </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

