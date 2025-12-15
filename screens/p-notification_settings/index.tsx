

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import SettingItem from './components/SettingItem';

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

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleGeneralNotificationToggle = (value: boolean) => {
    setIsGeneralNotificationEnabled(value);
    // 当总开关关闭时，关闭所有子开关
    if (!value) {
      setIsMessageNotificationEnabled(false);
      setIsActivityNotificationEnabled(false);
      setIsSystemNotificationEnabled(false);
      setIsMarketingNotificationEnabled(false);
      setIsSoundNotificationEnabled(false);
      setIsVibrationNotificationEnabled(false);
    }
  };

  const handleNotificationSettingChange = (
    settingType: string,
    value: boolean
  ) => {
    switch (settingType) {
      case 'message':
        setIsMessageNotificationEnabled(value);
        break;
      case 'activity':
        setIsActivityNotificationEnabled(value);
        break;
      case 'system':
        setIsSystemNotificationEnabled(value);
        break;
      case 'marketing':
        setIsMarketingNotificationEnabled(value);
        break;
      case 'sound':
        setIsSoundNotificationEnabled(value);
        break;
      case 'vibration':
        setIsVibrationNotificationEnabled(value);
        break;
    }
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
        <Text style={styles.headerTitle}>通知设置</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 通知开关 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>通知开关</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="bell"
              iconColor="#3b82f6"
              iconBackgroundColor="#dbeafe"
              title="接收通知"
              description="开启后接收应用通知"
              isEnabled={isGeneralNotificationEnabled}
              onToggle={handleGeneralNotificationToggle}
            />
          </View>
        </View>

        {/* 通知类型 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>通知类型</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="消息通知"
              description="接收新消息提醒"
              isEnabled={isMessageNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('message', value)}
              disabled={!isGeneralNotificationEnabled}
            />
            <SettingItem
              title="活动通知"
              description="接收点赞、评论等提醒"
              isEnabled={isActivityNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('activity', value)}
              disabled={!isGeneralNotificationEnabled}
            />
            <SettingItem
              title="系统通知"
              description="接收系统更新、维护等提醒"
              isEnabled={isSystemNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('system', value)}
              disabled={!isGeneralNotificationEnabled}
            />
            <SettingItem
              title="营销通知"
              description="接收活动、优惠等信息"
              isEnabled={isMarketingNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('marketing', value)}
              disabled={!isGeneralNotificationEnabled}
              isLast
            />
          </View>
        </View>

        {/* 通知方式 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>通知方式</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="声音提醒"
              description="收到通知时播放声音"
              isEnabled={isSoundNotificationEnabled}
              onToggle={(value) => handleNotificationSettingChange('sound', value)}
              disabled={!isGeneralNotificationEnabled}
            />
            <SettingItem
              title="振动提醒"
              description="收到通知时设备振动"
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

