

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../services/i18n';
import styles from './styles';
import { deleteUser } from '../../services/auth';
import DonationModal from '../../components/DonationModal';

const SettingsScreen = () => {
  const router = useRouter();
  const [isDonateModalVisible, setIsDonateModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('');

  useFocusEffect(
    useCallback(() => {
      updateLanguageDisplay();
    }, [])
  );

  const updateLanguageDisplay = () => {
    const locale = i18n.locale;
    const languageMap: Record<string, string> = {
      'zh': '简体中文',
      'en': 'English',
      'ja': '日本語',
      'ko': '한국어',
    };
    setCurrentLanguage(languageMap[locale] || locale);
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  
  // ... existing handlers ...

  const handleNotificationSettingsPress = () => {
    router.push('/p-notification_settings');
  };

  const handleLanguageSettingsPress = () => {
    router.push('/p-language_settings');
  };

  const handleDataCollectionPress = () => {
    router.push('/p-data_collection');
  };

  const handleAboutAppPress = () => {
    router.push('/p-about_app');
  };

  const handleDonatePress = () => {
    setIsDonateModalVisible(true);
  };

  const handlePrivacyPress = () => {
    router.push('/p-privacy_policy');
  };

  const handleTermsPress = () => {
    router.push('/p-terms_of_service');
  };

  const handleDeleteAccountPress = () => {
    Alert.alert(
      i18n.t('delete_account'),
      i18n.t('delete_account_confirm'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { 
          text: i18n.t('confirm_delete'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser();
              router.replace('/p-login_register');
            } catch (error) {
              Alert.alert(i18n.t('error'), i18n.t('delete_account_failed'));
            }
          }
        }
      ]
    );
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
        <Text style={styles.headerTitle}>{i18n.t('settings_title')}</Text>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 通用设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('general_settings')}</Text>
          <View style={styles.menuItemsContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleNotificationSettingsPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.blueIconContainer]}>
                  <FontAwesome6 name="bell" size={16} color="#3b82f6" />
                </View>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>{i18n.t('notification_settings')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('notification_settings_desc')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleLanguageSettingsPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.greenIconContainer]}>
                  <FontAwesome6 name="language" size={16} color="#10b981" />
                </View>
                <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemTitle}>{i18n.t('language_settings')}</Text>
                <Text style={styles.menuItemSubtitle}>{currentLanguage}</Text>
              </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 法律条款 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('legal_terms')}</Text>
          <View style={styles.menuItemsContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handlePrivacyPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.greenIconContainer]}>
                  <FontAwesome6 name="shield-halved" size={16} color="#10b981" />
                </View>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>{i18n.t('privacy_policy')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('privacy_policy_desc')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleTermsPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.blueIconContainer]}>
                  <FontAwesome6 name="file-contract" size={16} color="#3b82f6" />
                </View>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>{i18n.t('terms_of_service')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('terms_of_service_desc')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleDataCollectionPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.grayIconContainer]}>
                  <FontAwesome6 name="database" size={16} color="#6b7280" />
                </View>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>{i18n.t('data_collection')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('data_collection_desc')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 关于与帮助 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('about_and_help')}</Text>
          <View style={styles.menuItemsContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleAboutAppPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.purpleIconContainer]}>
                  <FontAwesome6 name="circle-info" size={16} color="#8b5cf6" />
                </View>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>{i18n.t('about_app')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('version_info')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleDonatePress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.blueIconContainer]}>
                  <FontAwesome6 name="mug-hot" size={16} color="#3b82f6" />
                </View>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>{i18n.t('support_us')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('buy_coffee')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 账户安全 - 危险区域 */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>{i18n.t('account_security')}</Text>
          <View style={styles.menuItemsContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleDeleteAccountPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.redIconContainer]}>
                  <FontAwesome6 name="trash-can" size={16} color="#ef4444" />
                </View>
                <View style={styles.menuItemTextContainer}>
                  <Text style={[styles.menuItemTitle, { color: '#ef4444' }]}>{i18n.t('delete_account')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('delete_account_desc')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <DonationModal
          visible={isDonateModalVisible}
          onClose={() => setIsDonateModalVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

