

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

const SettingsScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

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
        <Text style={styles.headerTitle}>设置</Text>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 通用设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通用设置</Text>
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
                  <Text style={styles.menuItemTitle}>通知设置</Text>
                  <Text style={styles.menuItemSubtitle}>管理应用通知</Text>
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
                  <Text style={styles.menuItemTitle}>语言设置</Text>
                  <Text style={styles.menuItemSubtitle}>简体中文</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 隐私设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>隐私设置</Text>
          <View style={styles.menuItemsContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleDataCollectionPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.purpleIconContainer]}>
                  <FontAwesome6 name="user-shield" size={16} color="#8b5cf6" />
                </View>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>数据收集</Text>
                  <Text style={styles.menuItemSubtitle}>管理数据使用权限</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 关于 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>
          <View style={styles.menuItemsContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleAboutAppPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.grayIconContainer]}>
                  <FontAwesome6 name="circle-info" size={16} color="#6b7280" />
                </View>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>关于码潮</Text>
                  <Text style={styles.menuItemSubtitle}>版本 1.0.0</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

