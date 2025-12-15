

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

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
      title: '代码分享',
      description: '码潮允许您轻松分享代码片段和项目：',
      steps: [
        '点击首页的"+"按钮创建新的代码片段',
        '选择编程语言，输入代码内容',
        '添加标题和描述以便于查找',
        '点击"分享"按钮生成分享链接',
        '您可以选择公开分享或仅分享给特定用户'
      ]
    },
    {
      icon: 'book',
      iconColor: '#10b981',
      iconBgColor: '#d1fae5',
      title: '学习资源',
      description: '探索码潮提供的丰富学习资源：',
      steps: [
        '在"发现"页面浏览热门代码片段',
        '关注感兴趣的开发者获取最新动态',
        '参与讨论区的技术交流',
        '收藏优质内容以便日后查看',
        '使用搜索功能查找特定主题的代码'
      ]
    },
    {
      icon: 'users',
      iconColor: '#8b5cf6',
      iconBgColor: '#ede9fe',
      title: '协作开发',
      description: '与团队成员协作开发项目：',
      steps: [
        '创建团队工作空间',
        '邀请成员加入您的项目',
        '设置不同成员的访问权限',
        '实时查看和评论代码变更',
        '通过版本控制追踪项目进展'
      ]
    },
    {
      icon: 'terminal',
      iconColor: '#f59e0b',
      iconBgColor: '#fef3c7',
      title: '代码运行',
      description: '直接在应用内运行和测试代码：',
      steps: [
        '支持多种编程语言的在线运行',
        '输入代码后点击"运行"按钮查看结果',
        '可以添加命令行参数和环境变量',
        '保存运行结果以便后续参考',
        '分享运行结果给其他用户'
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
        <Text style={styles.headerTitle}>功能使用</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 功能使用指南 */}
        <View style={styles.section}>
          {featureData.map((item, index) => renderFeatureItem(item, index))}
        </View>

        {/* 视频教程 */}
        <View style={styles.section}>
          <View style={styles.videoSection}>
            <Text style={styles.videoSectionTitle}>视频教程</Text>
            <View style={styles.videoPlaceholder}>
              <FontAwesome5 name="play-circle" size={48} color="#2563eb" />
            </View>
            <Text style={styles.videoDescription}>
              观看视频教程了解更多功能使用方法
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FunctionUsageScreen;

