
import i18n from '../../services/i18n';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import SettingItem from './components/SettingItem';

const STORAGE_KEY = '@notification_settings';

const NotificationSettingsScreen = () => {
  const router = useRouter();
  
  // 通知设置状态
  const [isGeneralNotificationEnabled, setIsGeneralNotificationEnabled] = useState(true);
  const [isMessageNotificationEnabled, setIsMessageNotificationEnabled] = useState(true);
  const [isActivityNotificationEnabled, setIsActivityNotificationEnabled] = useState(true);
  const [isSystemNotificationEnabled, setIsSystemNotificationEnabled] = useState(true);
  const [isMarketingNotificationEnabled, setIsMarketingNotificationEnabled] = useState(false);
  const [isSoundNotificationEnabled, setIsSoundNotificationEnabled] = useState(true);
  const [isVibrationNotificationEnabled, setIsVibrationNotificationEnabled] = useState(true);

  // 加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setIsGeneralNotificationEnabled(settings.general ?? true);
        setIsMessageNotificationEnabled(settings.message ?? true);
        setIsActivityNotificationEnabled(settings.activity ?? true);
        setIsSystemNotificationEnabled(settings.system ?? true);
        setIsMarketingNotificationEnabled(settings.marketing ?? false);
        setIsSoundNotificationEnabled(settings.sound ?? true);
        setIsVibrationNotificationEnabled(settings.vibration ?? true);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

  const saveSettings = async (settings: any) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleGeneralNotificationToggle = (value: boolean) => {
    setIsGeneralNotificationEnabled(value);
    
    const newSettings = {
      general: value,
      message: isMessageNotificationEnabled,
      activity: isActivityNotificationEnabled,
      system: isSystemNotificationEnabled,
      marketing: isMarketingNotificationEnabled,
      sound: isSoundNotificationEnabled,
      vibration: isVibrationNotificationEnabled,
    };

    // 当总开关关闭时，关闭所有子开关（视觉上），但保持状态以便重新开启时恢复？
    // 或者直接修改所有状态？这里沿用原有逻辑：只是关闭
    if (!value) {
        // 原有逻辑是关闭所有状态，这里我们需要决定是“视觉禁用”还是“状态重置”
        // 原代码逻辑：
        setIsMessageNotificationEnabled(false);
        setIsActivityNotificationEnabled(false);
        setIsSystemNotificationEnabled(false);
        setIsMarketingNotificationEnabled(false);
        setIsSoundNotificationEnabled(false);
        setIsVibrationNotificationEnabled(false);
        
        // 更新保存的设置
        newSettings.message = false;
        newSettings.activity = false;
        newSettings.system = false;
        newSettings.marketing = false;
        newSettings.sound = false;
        newSettings.vibration = false;
    }
    
    saveSettings(newSettings);
  };

  const handleNotificationSettingChange = (
    settingType: string,
    value: boolean
  ) => {
    let newSettings = {
      general: isGeneralNotificationEnabled,
      message: isMessageNotificationEnabled,
      activity: isActivityNotificationEnabled,
      system: isSystemNotificationEnabled,
      marketing: isMarketingNotificationEnabled,
      sound: isSoundNotificationEnabled,
      vibration: isVibrationNotificationEnabled,
    };

    switch (settingType) {
      case 'message':
        setIsMessageNotificationEnabled(value);
        newSettings.message = value;
        break;
      case 'activity':
        setIsActivityNotificationEnabled(value);
        newSettings.activity = value;
        break;
      case 'system':
        setIsSystemNotificationEnabled(value);
        newSettings.system = value;
        break;
      case 'marketing':
        setIsMarketingNotificationEnabled(value);
        newSettings.marketing = value;
        break;
      case 'sound':
        setIsSoundNotificationEnabled(value);
        newSettings.sound = value;
        break;
      case 'vibration':
        setIsVibrationNotificationEnabled(value);
        newSettings.vibration = value;
        break;
    }
    
    saveSettings(newSettings);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="chevron-left" size={16} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('notification_settings')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 通知开关 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{i18n.t('notification_switch')}</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="bell"
              iconColor="#3b82f6"
              iconBackgroundColor="#dbeafe"
              title={i18n.t('receive_notifications')}
              description={i18n.t('receive_notifications_desc')}
              isEnabled={isGeneralNotificationEnabled}
              onToggle={handleGeneralNotificationToggle}
            />
          </View>
        </View>

        {/* 通知类型 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{i18n.t('notification_types')}</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title={i18n.t('message_notification')}
              description={i18n.t('message_notification_desc')}
              isEnabled={isMessageNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('message', value)}
              disabled={!isGeneralNotificationEnabled}
            />
            <SettingItem
              title={i18n.t('activity_notification')}
              description={i18n.t('activity_notification_desc')}
              isEnabled={isActivityNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('activity', value)}
              disabled={!isGeneralNotificationEnabled}
            />
            <SettingItem
              title={i18n.t('system_notification')}
              description={i18n.t('system_notification_desc')}
              isEnabled={isSystemNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('system', value)}
              disabled={!isGeneralNotificationEnabled}
            />
            <SettingItem
              title={i18n.t('marketing_notification')}
              description={i18n.t('marketing_notification_desc')}
              isEnabled={isMarketingNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('marketing', value)}
              disabled={!isGeneralNotificationEnabled}
              isLast
            />
          </View>
        </View>

        {/* 通知方式 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{i18n.t('notification_method')}</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title={i18n.t('sound_notification')}
              description={i18n.t('sound_notification_desc')}
              isEnabled={isSoundNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('sound', value)}
              disabled={!isGeneralNotificationEnabled}
            />
            <SettingItem
              title={i18n.t('vibration_notification')}
              description={i18n.t('vibration_notification_desc')}
              isEnabled={isVibrationNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('vibration', value)}
              disabled={!isGeneralNotificationEnabled}
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;

