

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import i18n from '../../services/i18n';

const FunctionUsageScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const featureData = [
    {
      icon: 'code',
      iconColor: '#3b82f6',
      iconBgColor: '#dbeafe',
      title: i18n.t('func_share_code_title'),
      description: i18n.t('func_share_code_desc'),
      steps: [
        i18n.t('func_share_code_step_1'),
        i18n.t('func_share_code_step_2'),
        i18n.t('func_share_code_step_3'),
        i18n.t('func_share_code_step_4'),
        i18n.t('func_share_code_step_5')
      ]
    },
    {
      icon: 'book',
      iconColor: '#10b981',
      iconBgColor: '#d1fae5',
      title: i18n.t('func_learning_title'),
      description: i18n.t('func_learning_desc'),
      steps: [
        i18n.t('func_learning_step_1'),
        i18n.t('func_learning_step_2'),
        i18n.t('func_learning_step_3'),
        i18n.t('func_learning_step_4'),
        i18n.t('func_learning_step_5')
      ]
    },
    {
      icon: 'users',
      iconColor: '#8b5cf6',
      iconBgColor: '#ede9fe',
      title: i18n.t('func_collab_title'),
      description: i18n.t('func_collab_desc'),
      steps: [
        i18n.t('func_collab_step_1'),
        i18n.t('func_collab_step_2'),
        i18n.t('func_collab_step_3'),
        i18n.t('func_collab_step_4'),
        i18n.t('func_collab_step_5')
      ]
    },
    {
      icon: 'terminal',
      iconColor: '#f59e0b',
      iconBgColor: '#fef3c7',
      title: i18n.t('func_run_code_title'),
      description: i18n.t('func_run_code_desc'),
      steps: [
        i18n.t('func_run_code_step_1'),
        i18n.t('func_run_code_step_2'),
        i18n.t('func_run_code_step_3'),
        i18n.t('func_run_code_step_4'),
        i18n.t('func_run_code_step_5')
      ]
    }
  ];

  const renderFeatureItem = (item: typeof featureData[0], index: number) => (
    <View key={index} style={[styles.featureItem, index === featureData.length - 1 && styles.featureItemLast]}>
      <View style={styles.featureTitle}>
        <View style={[styles.featureIcon, { backgroundColor: item.iconBgColor }]}>
          <FontAwesome6 name={item.icon} size={20} color={item.iconColor} />
        </View>
        <Text style={styles.featureTitleText}>{item.title}</Text>
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureDescription}>{item.description}</Text>
        <View style={styles.stepsList}>
          {item.steps.map((step, stepIndex) => (
            <View key={stepIndex} style={styles.stepItem}>
              <Text style={styles.stepBullet}>•</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome6 name="chevron-left" size={16} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('function_usage_title')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 功能使用指南 */}
        <View style={styles.section}>
          {featureData.map((item, index) => renderFeatureItem(item, index))}
        </View>

        {/* 视频教程 */}
        <View style={styles.section}>
          <View style={styles.videoSection}>
            <Text style={styles.videoSectionTitle}>{i18n.t('video_tutorial_title')}</Text>
            <View style={styles.videoPlaceholder}>
              <FontAwesome5 name="play-circle" size={48} color="#2563eb" />
            </View>
            <Text style={styles.videoDescription}>
              {i18n.t('video_tutorial_desc')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FunctionUsageScreen;

