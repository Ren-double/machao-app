

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import i18n from '../../services/i18n';
import styles from './styles';

const STORAGE_KEY = '@language_settings';

interface LanguageOption {
  id: string;
  name: string;
  englishName: string;
  iconColor: string;
  backgroundColor: string;
}

const LanguageSettingsScreen = () => {
  const router = useRouter();
  const [selectedLanguageId, setSelectedLanguageId] = useState('chinese');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLanguage) {
        setSelectedLanguageId(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to load language settings:', error);
    }
  };

  const languageOptions: LanguageOption[] = [
    {
      id: 'chinese',
      name: '简体中文',
      englishName: 'Chinese (Simplified)',
      iconColor: '#ef4444',
      backgroundColor: '#fef2f2',
    },
    {
      id: 'english',
      name: 'English',
      englishName: '英文',
      iconColor: '#3b82f6',
      backgroundColor: '#eff6ff',
    },
    {
      id: 'japanese',
      name: '日本語',
      englishName: 'Japanese',
      iconColor: '#ec4899',
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'korean',
      name: '한국어',
      englishName: 'Korean',
      iconColor: '#3b82f6',
      backgroundColor: '#eff6ff',
    },
  ];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleLanguageSelect = (language: LanguageOption) => {
    if (language.id === selectedLanguageId) {
      return;
    }

    Alert.alert(
      i18n.t('confirm_change'),
      i18n.t('change_language_confirm', { language: language.name }),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('confirm'),
          onPress: async () => {
            try {
              await AsyncStorage.setItem(STORAGE_KEY, language.id);
              setSelectedLanguageId(language.id);
              
              Alert.alert(
                i18n.t('settings_saved'),
                i18n.t('restart_app_hint'),
                [
                  {
                    text: i18n.t('confirm'),
                    onPress: async () => {
                      try {
                        await Updates.reloadAsync();
                      } catch (error) {
                        // Fallback if reload fails (e.g. in development)
                        if (router.canGoBack()) {
                          router.back();
                        }
                      }
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Failed to save language settings:', error);
              Alert.alert(i18n.t('error'), i18n.t('save_error'));
            }
          },
        },
      ]
    );
  };

  const renderLanguageItem = (language: LanguageOption) => {
    const isSelected = language.id === selectedLanguageId;

    return (
      <TouchableOpacity
        key={language.id}
        style={styles.languageItem}
        onPress={() => handleLanguageSelect(language)}
        activeOpacity={0.7}
      >
        <View style={styles.languageItemContent}>
          <View style={[styles.languageIconContainer, { backgroundColor: language.backgroundColor }]}>
            <FontAwesome6 name="flag" size={16} color={language.iconColor} />
          </View>
          <View style={styles.languageTextContainer}>
            <Text style={styles.languageName}>{language.name}</Text>
            <Text style={styles.languageEnglishName}>{language.englishName}</Text>
          </View>
        </View>
        {isSelected && (
          <FontAwesome6 name="check" size={16} color="#2563eb" />
        )}
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>{i18n.t('p_language_settings')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 语言选择卡片 */}
        <View style={styles.languageCard}>
          <View style={styles.languageCardHeader}>
            <Text style={styles.languageCardTitle}>{i18n.t('select_language')}</Text>
          </View>
          <View style={styles.languageList}>
            {languageOptions.map(renderLanguageItem)}
          </View>
        </View>

        {/* 提示信息 */}
        <View style={styles.tipContainer}>
          <View style={styles.tipContent}>
            <FontAwesome6 name="circle-info" size={14} color="#3b82f6" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              {i18n.t('restart_app_tip')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LanguageSettingsScreen;

