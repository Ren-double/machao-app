

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../services/i18n';
import styles from './styles';

const STORAGE_KEY = '@data_collection_settings';

const DataCollectionScreen = () => {
  const router = useRouter();
  
  // 数据收集设置状态
  const [isUsageDataEnabled, setIsUsageDataEnabled] = useState(true);
  const [isCrashDataEnabled, setIsCrashDataEnabled] = useState(true);
  const [isPersonalizedAdsEnabled, setIsPersonalizedAdsEnabled] = useState(false);

  // 加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setIsUsageDataEnabled(settings.usage ?? true);
        setIsCrashDataEnabled(settings.crash ?? true);
        setIsPersonalizedAdsEnabled(settings.ads ?? false);
      }
    } catch (error) {
      console.error('Failed to load data collection settings:', error);
    }
  };

  const saveSettings = async (settings: any) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save data collection settings:', error);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handlePrivacyPolicyPress = () => {
    Alert.alert(i18n.t('privacy_policy'), i18n.t('view_privacy_policy'));
    // 这里可以添加跳转到隐私政策页面的逻辑
  };

  const handleDeleteDataPress = () => {
    Alert.alert(
      i18n.t('request_delete_data'),
      i18n.t('delete_data_confirm_msg'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('confirm'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(i18n.t('submit_success'), i18n.t('delete_data_success_msg'));
          },
        },
      ]
    );
  };

  const handleUsageDataToggle = (value: boolean) => {
    setIsUsageDataEnabled(value);
    saveSettings({
      usage: value,
      crash: isCrashDataEnabled,
      ads: isPersonalizedAdsEnabled,
    });
  };

  const handleCrashDataToggle = (value: boolean) => {
    setIsCrashDataEnabled(value);
    saveSettings({
      usage: isUsageDataEnabled,
      crash: value,
      ads: isPersonalizedAdsEnabled,
    });
  };

  const handlePersonalizedAdsToggle = (value: boolean) => {
    setIsPersonalizedAdsEnabled(value);
    saveSettings({
      usage: isUsageDataEnabled,
      crash: isCrashDataEnabled,
      ads: value,
    });
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
        <Text style={styles.headerTitle}>{i18n.t('data_collection_title')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 数据收集选项卡片 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{i18n.t('data_collection_options')}</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemTitle}>{i18n.t('usage_data_title')}</Text>
              <Text style={styles.settingItemDescription}>{i18n.t('usage_data_desc')}</Text>
            </View>
            <Switch
              value={isUsageDataEnabled}
              onValueChange={handleUsageDataToggle}
              trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemTitle}>{i18n.t('crash_data_title')}</Text>
              <Text style={styles.settingItemDescription}>{i18n.t('crash_data_desc')}</Text>
            </View>
            <Switch
              value={isCrashDataEnabled}
              onValueChange={handleCrashDataToggle}
              trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemTitle}>{i18n.t('ads_data_title')}</Text>
              <Text style={styles.settingItemDescription}>{i18n.t('ads_data_desc')}</Text>
            </View>
            <Switch
              value={isPersonalizedAdsEnabled}
              onValueChange={handlePersonalizedAdsToggle}
              trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* 隐私政策按钮 */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handlePrivacyPolicyPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="shield-halved" size={16} color="#111827" style={styles.actionButtonIcon} />
          <Text style={styles.actionButtonText}>{i18n.t('view_privacy_policy')}</Text>
        </TouchableOpacity>

        {/* 删除数据按钮 */}
        <TouchableOpacity 
          style={styles.dangerButton} 
          onPress={handleDeleteDataPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="trash-can" size={16} color="#ef4444" style={styles.actionButtonIcon} />
          <Text style={styles.dangerButtonText}>{i18n.t('request_delete_data')}</Text>
        </TouchableOpacity>

        {/* 提示信息 */}
        <View style={styles.infoBox}>
          <FontAwesome6 name="circle-info" size={16} color="#3b82f6" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            {i18n.t('data_privacy_info')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataCollectionScreen;

