

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

const DataCollectionScreen = () => {
  const router = useRouter();
  
  // 数据收集设置状态
  const [isUsageDataEnabled, setIsUsageDataEnabled] = useState(true);
  const [isCrashDataEnabled, setIsCrashDataEnabled] = useState(true);
  const [isPersonalizedAdsEnabled, setIsPersonalizedAdsEnabled] = useState(false);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handlePrivacyPolicyPress = () => {
    Alert.alert('隐私政策', '跳转到隐私政策页面');
    // 这里可以添加跳转到隐私政策页面的逻辑
  };

  const handleDeleteDataPress = () => {
    Alert.alert(
      '删除数据',
      '确定要请求删除您的数据吗？此操作可能需要一定时间处理。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            Alert.alert('提交成功', '数据删除请求已提交，我们将尽快处理。');
          },
        },
      ]
    );
  };

  const handleUsageDataToggle = (value: boolean) => {
    setIsUsageDataEnabled(value);
    // 这里可以添加保存设置的逻辑
  };

  const handleCrashDataToggle = (value: boolean) => {
    setIsCrashDataEnabled(value);
    // 这里可以添加保存设置的逻辑
  };

  const handlePersonalizedAdsToggle = (value: boolean) => {
    setIsPersonalizedAdsEnabled(value);
    // 这里可以添加保存设置的逻辑
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
        <Text style={styles.headerTitle}>数据收集设置</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 数据收集选项卡片 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>数据收集选项</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemTitle}>使用数据收集</Text>
              <Text style={styles.settingItemDescription}>收集应用使用情况以改进服务</Text>
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
              <Text style={styles.settingItemTitle}>崩溃数据收集</Text>
              <Text style={styles.settingItemDescription}>收集应用崩溃信息以修复问题</Text>
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
              <Text style={styles.settingItemTitle}>个性化广告</Text>
              <Text style={styles.settingItemDescription}>根据您的兴趣显示相关广告</Text>
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
          <Text style={styles.actionButtonText}>查看隐私政策</Text>
        </TouchableOpacity>

        {/* 删除数据按钮 */}
        <TouchableOpacity 
          style={styles.dangerButton} 
          onPress={handleDeleteDataPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="trash-can" size={16} color="#ef4444" style={styles.actionButtonIcon} />
          <Text style={styles.dangerButtonText}>请求删除我的数据</Text>
        </TouchableOpacity>

        {/* 提示信息 */}
        <View style={styles.infoBox}>
          <FontAwesome6 name="circle-info" size={16} color="#3b82f6" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            我们重视您的隐私保护，所有收集的数据将严格按照隐私政策进行处理。您可以随时更改这些设置。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataCollectionScreen;

