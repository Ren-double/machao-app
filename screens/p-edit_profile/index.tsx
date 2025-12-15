

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
}

const EditProfileScreen = () => {
  const router = useRouter();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    nickname: '开发者小王',
    bio: '',
    location: '',
    website: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [bioCharacterCount, setBioCharacterCount] = useState(0);
  
  const bioInputRef = useRef<TextInput>(null);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleSavePress = async () => {
    setIsSaving(true);
    
    try {
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存头像到本地存储
      if (profileData.avatar.startsWith('data:image/')) {
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

            {/* 所在地输入框 */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={profileData.location}
                  onChangeText={handleLocationChange}
                  placeholder="所在地"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            {/* 个人网站输入框 */}
            <View style={[styles.inputGroup, styles.lastInputGroup]}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={profileData.website}
                  onChangeText={handleWebsiteChange}
                  placeholder="个人网站"
                  placeholderTextColor="#64748b"
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* 附加信息 */}
          <View style={styles.additionalInfoSection}>
            <View style={styles.additionalInfoHeader}>
              <FontAwesome6 name="circle-info" size={16} color="#3b82f6" />
              <Text style={styles.additionalInfoTitle}>附加信息</Text>
            </View>
            
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>注册时间</Text>
                <Text style={styles.infoValue}>2023年10月</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>最后活跃</Text>
                <Text style={styles.infoValue}>刚刚</Text>
              </View>
              
              <View style={[styles.infoItem, styles.lastInfoItem]}>
                <Text style={styles.infoLabel}>账号状态</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>正常</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 底部操作栏 */}
        <View style={styles.bottomActionBar}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelPress}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

