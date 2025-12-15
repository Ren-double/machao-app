

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import Svg, { Defs, Pattern, Path, Rect, Polyline, Circle, Text as SvgText } from 'react-native-svg';
import styles from './styles';

interface ProjectData {
  id: string;
  name: string;
  author: string;
  description: string;
  avatar: string;
  stars: string;
  forks: string;
  contributors: string;
  language: string;
  lastUpdated: string;
  githubUrl: string;
  docsUrl: string;
  isBookmarked: boolean;
}

type TrendPeriod = '7d' | '30d' | '90d';

const ProjectDetailScreen: React.FC = () => {
  const router = useRouter();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedTrendPeriod, setSelectedTrendPeriod] = useState<TrendPeriod>('7d');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 模拟项目数据
  const mockProjects: Record<string, ProjectData> = {
    'project1': {
      id: 'project1',
      name: 'React Query',
      author: 'TanStack / react-query',
      description: 'Hooks for fetching, caching and updating asynchronous data in React. React Query makes fetching, caching, synchronizing and updating server state in your React applications a breeze.',
      avatar: 'https://s.coze.cn/image/xhpzRoBP_Hw/',
      stars: '35.2k',
      forks: '2.8k',
      contributors: '156',
      language: 'JavaScript',
      lastUpdated: '2小时前更新',
      githubUrl: 'https://github.com/TanStack/react-query',
      docsUrl: 'https://tanstack.com/query/latest',
      isBookmarked: false,
    },
    'project2': {
      id: 'project2',
      name: 'FastAPI',
      author: 'tiangolo / fastapi',
      description: 'FastAPI framework, high performance, easy to learn, fast to code, ready for production. FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints.',
      avatar: 'https://s.coze.cn/image/qBiRH7UOIOY/',
      stars: '68.9k',
      forks: '7.2k',
      contributors: '342',
      language: 'Python',
      lastUpdated: '1天前更新',
      githubUrl: 'https://github.com/tiangolo/fastapi',
      docsUrl: 'https://fastapi.tiangolo.com/',
      isBookmarked: true,
    },
    'project3': {
      id: 'project3',
      name: 'Spring Boot',
      author: 'spring-projects / spring-boot',
      description: 'Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run". We take an opinionated view of the Spring platform and third-party libraries so you can get started with minimum fuss.',
      avatar: 'https://s.coze.cn/image/IrVYQamDBaw/',
      stars: '69.1k',
      forks: '42.3k',
      contributors: '678',
      language: 'Java',
      lastUpdated: '3小时前更新',
      githubUrl: 'https://github.com/spring-projects/spring-boot',
      docsUrl: 'https://spring.io/projects/spring-boot',
      isBookmarked: false,
    },
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setIsLoading(true);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentProjectId = projectId || 'project1';
      const project = mockProjects[currentProjectId];
      
      if (project) {
        setProjectData(project);
        setIsBookmarked(project.isBookmarked);
      } else {
        Alert.alert('错误', '项目未找到');
        router.back();
      }
    } catch (error) {
      console.error('加载项目数据失败:', error);
      Alert.alert('错误', '加载项目数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/p-home');
    }
  };

  const handleBookmarkPress = () => {
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    
    if (projectData) {
      // 更新模拟数据
      mockProjects[projectData.id].isBookmarked = newBookmarkedState;
    }
    
    showToast(newBookmarkedState ? '收藏成功' : '取消收藏');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);
  };

  const handleTrendPeriodPress = (period: TrendPeriod) => {
    setSelectedTrendPeriod(period);
    // 这里可以添加切换趋势图数据的逻辑
  };

  const handleGithubPress = async () => {
    if (projectData?.githubUrl) {
      try {
        const supported = await Linking.canOpenURL(projectData.githubUrl);
        if (supported) {
          await Linking.openURL(projectData.githubUrl);
        } else {
          Alert.alert('错误', '无法打开链接');
        }
      } catch (error) {
        console.error('打开GitHub链接失败:', error);
        Alert.alert('错误', '打开链接失败');
      }
    }
  };

  const handleDocsPress = async () => {
    if (projectData?.docsUrl) {
      try {
        const supported = await Linking.canOpenURL(projectData.docsUrl);
        if (supported) {
          await Linking.openURL(projectData.docsUrl);
        } else {
          Alert.alert('错误', '无法打开链接');
        }
      } catch (error) {
        console.error('打开文档链接失败:', error);
        Alert.alert('错误', '打开链接失败');
      }
    }
  };

  const getLanguageTagStyle = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
        return styles.languageJavaScript;
      case 'python':
        return styles.languagePython;
      case 'java':
        return styles.languageJava;
      case 'go':
        return styles.languageGo;
      default:
        return styles.languageJavaScript;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!projectData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>项目数据加载失败</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProjectData}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
          <FontAwesome6 name="arrow-left" size={16} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>项目详情</Text>
        <TouchableOpacity 
          style={[
            styles.headerButton,
            isBookmarked && styles.bookmarkedButton
          ]} 
          onPress={handleBookmarkPress}
        >
          <FontAwesome6 
            name="bookmark" 
            size={16} 
            color={isBookmarked ? '#2563eb' : '#6b7280'}
            solid={isBookmarked}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 项目基本信息 */}
        <View style={styles.projectInfoCard}>
          <View style={styles.projectInfoHeader}>
            <View style={styles.projectInfoContent}>
              <Text style={styles.projectName}>{projectData.name}</Text>
              <Text style={styles.projectAuthor}>{projectData.author}</Text>
              <Text style={styles.projectDescription}>{projectData.description}</Text>
            </View>
            <Image source={{ uri: projectData.avatar }} style={styles.projectAvatar} />
          </View>
          
          {/* 项目统计信息 */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statValueContainer}>
                <FontAwesome6 name="star" size={14} color="#f59e0b" solid />
                <Text style={styles.statValue}>{projectData.stars}</Text>
              </View>
              <Text style={styles.statLabel}>星标</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statValueContainer}>
                <FontAwesome6 name="code-branch" size={14} color="#6b7280" />
                <Text style={styles.statValue}>{projectData.forks}</Text>
              </View>
              <Text style={styles.statLabel}>分支</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statValueContainer}>
                <FontAwesome6 name="users" size={14} color="#6b7280" />
                <Text style={styles.statValue}>{projectData.contributors}</Text>
              </View>
              <Text style={styles.statLabel}>贡献者</Text>
            </View>
          </View>
          
          {/* 编程语言和更新时间 */}
          <View style={styles.metaContainer}>
            <View style={[styles.languageTag, getLanguageTagStyle(projectData.language)]}>
              <Text style={styles.languageTagText}>{projectData.language}</Text>
            </View>
            <Text style={styles.lastUpdated}>{projectData.lastUpdated}</Text>
          </View>
        </View>

        {/* 项目趋势图 */}
        <View style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <Text style={styles.trendTitle}>星标趋势</Text>
            <View style={styles.trendPeriodContainer}>
              <TouchableOpacity 
                style={[
                  styles.trendPeriodButton,
                  selectedTrendPeriod === '7d' && styles.trendPeriodButtonActive
                ]}
                onPress={() => handleTrendPeriodPress('7d')}
              >
                <Text style={[
                  styles.trendPeriodButtonText,
                  selectedTrendPeriod === '7d' && styles.trendPeriodButtonTextActive
                ]}>
                  7天
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.trendPeriodButton,
                  selectedTrendPeriod === '30d' && styles.trendPeriodButtonActive
                ]}
                onPress={() => handleTrendPeriodPress('30d')}
              >
                <Text style={[
                  styles.trendPeriodButtonText,
                  selectedTrendPeriod === '30d' && styles.trendPeriodButtonTextActive
                ]}>
                  30天
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.trendPeriodButton,
                  selectedTrendPeriod === '90d' && styles.trendPeriodButtonActive
                ]}
                onPress={() => handleTrendPeriodPress('90d')}
              >
                <Text style={[
                  styles.trendPeriodButtonText,
                  selectedTrendPeriod === '90d' && styles.trendPeriodButtonTextActive
                ]}>
                  90天
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* 趋势图表 */}
          <View style={styles.chartContainer}>
            <Svg width="100%" height="150" viewBox="0 0 300 150">
              <Defs>
                <Pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
                  <Path d="M 50 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* 趋势线 */}
              <Polyline 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="2" 
                strokeLinecap="round"
                points="20,120 60,90 100,70 140,60 180,45 220,35 260,25"
              />
              
              {/* 数据点 */}
              <Circle cx="20" cy="120" r="3" fill="#2563eb"/>
              <Circle cx="60" cy="90" r="3" fill="#2563eb"/>
              <Circle cx="100" cy="70" r="3" fill="#2563eb"/>
              <Circle cx="140" cy="60" r="3" fill="#2563eb"/>
              <Circle cx="180" cy="45" r="3" fill="#2563eb"/>
              <Circle cx="220" cy="35" r="3" fill="#2563eb"/>
              <Circle cx="260" cy="25" r="3" fill="#2563eb"/>
              
              {/* Y轴标签 */}
              <SvgText x="10" y="25" textAnchor="end" fontSize="10" fill="#6b7280">35.2k</SvgText>
              <SvgText x="10" y="65" textAnchor="end" fontSize="10" fill="#6b7280">34.8k</SvgText>
              <SvgText x="10" y="105" textAnchor="end" fontSize="10" fill="#6b7280">34.4k</SvgText>
              <SvgText x="10" y="145" textAnchor="end" fontSize="10" fill="#6b7280">34.0k</SvgText>
            </Svg>
          </View>
          
          {/* 今日增长 */}
          <View style={styles.trendGrowthContainer}>
            <View style={styles.trendGrowthLeft}>
              <FontAwesome6 name="arrow-up" size={14} color="#10b981" />
              <Text style={styles.trendGrowthText}>今日新增 +120</Text>
            </View>
            <Text style={styles.trendGrowthPercent}>较昨日 +15%</Text>
          </View>
        </View>

        {/* 项目链接 */}
        <View style={styles.linksCard}>
          <Text style={styles.linksTitle}>相关链接</Text>
          <View style={styles.linksContainer}>
            <TouchableOpacity style={styles.linkItem} onPress={handleGithubPress}>
              <View style={styles.linkItemLeft}>
                <FontAwesome6 name="github" size={18} color="#1f2937" />
                <Text style={styles.linkItemText}>GitHub 仓库</Text>
              </View>
              <FontAwesome6 name="external-link" size={14} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem} onPress={handleDocsPress}>
              <View style={styles.linkItemLeft}>
                <FontAwesome6 name="book" size={18} color="#1f2937" />
                <Text style={styles.linkItemText}>官方文档</Text>
              </View>
              <FontAwesome6 name="external-link" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity style={styles.githubButton} onPress={handleGithubPress}>
          <FontAwesome6 name="github" size={16} color="#ffffff" />
          <Text style={styles.githubButtonText}>前往 GitHub</Text>
        </TouchableOpacity>
      </View>

      {/* 轻提示 */}
      {isToastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProjectDetailScreen;

