

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../services/i18n';
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
            joinDateStr: joinDateStr || i18n.t('unknown'),
            lastActiveStr: lastActiveStr || i18n.t('just_now')
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
      
      Alert.alert(i18n.t('success'), i18n.t('profile_saved'), [
        {
          text: i18n.t('ok'),
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('save_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelPress = () => {
    Alert.alert(
      i18n.t('confirm_cancel'),
      i18n.t('cancel_edit_confirm'),
      [
        { text: i18n.t('continue_editing'), style: 'cancel' },
        {
          text: i18n.t('confirm_cancel_button'),
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
        Alert.alert(i18n.t('permission_denied'), i18n.t('camera_permission_required'));
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
          Alert.alert(i18n.t('file_too_large'), i18n.t('file_size_limit'));
          return;
        }

        setProfileData(prev => ({
          ...prev,
          avatar: asset.uri,
        }));
        
        Alert.alert(i18n.t('success'), i18n.t('avatar_upload_success'));
      }
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('avatar_upload_failed'));
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
          
          <Text style={styles.headerTitle}>{i18n.t('p_edit_profile')}</Text>
          
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSavePress}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <View style={styles.saveButtonContent}>
                <FontAwesome6 name="spinner" size={14} color="#ffffff" />
                <Text style={styles.saveButtonText}>{i18n.t('saving')}</Text>
              </View>
            ) : (
              <Text style={styles.saveButtonText}>{i18n.t('save')}</Text>
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
              <Text style={styles.changeAvatarButtonText}>{i18n.t('change_avatar')}</Text>
            </TouchableOpacity>
            
            <Text style={styles.avatarHint}>
              {i18n.t('avatar_hint')}
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
                  placeholder={i18n.t('nickname')}
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
                  placeholder={i18n.t('bio')}
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
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#334155', marginBottom: 12 }}>{i18n.t('account_info')}</Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#64748b' }}>{i18n.t('join_date')}</Text>
                    <Text style={{ color: '#334155', fontWeight: '500' }}>{profileData.joinDateStr}</Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#64748b' }}>{i18n.t('last_active')}</Text>
                    <Text style={{ color: '#334155', fontWeight: '500' }}>{profileData.lastActiveStr}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#64748b' }}>{i18n.t('account_status')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 6 }} />
                        <Text style={{ color: '#10b981', fontWeight: '500' }}>{i18n.t('status_normal')}</Text>
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

