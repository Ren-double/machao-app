

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import CategoryCard from './components/CategoryCard';
import TopicCard from './components/TopicCard';
import FeaturedProjectCard from './components/FeaturedProjectCard';

interface CategoryItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

interface TopicItem {
  id: string;
  title: string;
  discussionCount: string;
  tag: string;
  color: string;
  backgroundColor: string;
}

interface FeaturedProjectItem {
  id: string;
  title: string;
  owner: string;
  repo: string;
  description: string;
  starCount: string;
  forkCount: string;
  language: string;
  languageColor: string;
  languageBgColor: string;
  trendCount: string;
  isBookmarked: boolean;
}

const DiscoverScreen: React.FC = () => {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProjectItem[]>([
    {
      id: '1',
      title: 'Next.js',
      owner: 'vercel',
      repo: 'next.js',
      description: 'The React Framework for Production',
      starCount: '112k',
      forkCount: '19.5k',
      language: 'JavaScript',
      languageColor: '#92400e',
      languageBgColor: '#fef3c7',
      trendCount: '+2.3k',
      isBookmarked: false,
    },
    {
      id: '2',
      title: 'Django',
      owner: 'django',
      repo: 'django',
      description: 'The Web framework for perfectionists with deadlines.',
      starCount: '71.2k',
      forkCount: '29.8k',
      language: 'Python',
      languageColor: '#1e40af',
      languageBgColor: '#dbeafe',
      trendCount: '+1.4k',
      isBookmarked: false,
    },
  ]);

  const categories: CategoryItem[] = [
    { id: 'frontend', title: '前端', icon: 'code', color: '#2563eb', backgroundColor: '#dbeafe' },
    { id: 'backend', title: '后端', icon: 'server', color: '#10b981', backgroundColor: '#dcfce7' },
    { id: 'ai', title: 'AI', icon: 'brain', color: '#8b5cf6', backgroundColor: '#ede9fe' },
    { id: 'mobile', title: '移动', icon: 'mobile-screen', color: '#ef4444', backgroundColor: '#fee2e2' },
    { id: 'tools', title: '工具', icon: 'screwdriver-wrench', color: '#f59e0b', backgroundColor: '#fef3c7' },
    { id: 'devops', title: 'DevOps', icon: 'gears', color: '#6b7280', backgroundColor: '#f3f4f6' },
    { id: 'data', title: '数据', icon: 'database', color: '#06b6d4', backgroundColor: '#cffafe' },
    { id: 'more', title: '更多', icon: 'ellipsis', color: '#6b7280', backgroundColor: '#f3f4f6' },
  ];

  const topics: TopicItem[] = [
    { id: '1', title: '#AI编程助手', discussionCount: '1.2k 讨论 · 今日热门', tag: '今日热门', color: '#2563eb', backgroundColor: '#dbeafe' },
    { id: '2', title: '#前端框架对比', discussionCount: '856 讨论 · 本周热门', tag: '本周热门', color: '#10b981', backgroundColor: '#dcfce7' },
    { id: '3', title: '#开源贡献指南', discussionCount: '623 讨论 · 本月热门', tag: '本月热门', color: '#8b5cf6', backgroundColor: '#ede9fe' },
  ];

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearchButtonPress = (): void => {
    searchInputRef.current?.focus();
  };

  const handleCategoryPress = (category: CategoryItem): void => {
    Alert.alert('分类选择', `已选择${category.title}分类`);
  };

  const handleTopicPress = (topic: TopicItem): void => {
    Alert.alert('话题查看', `查看话题: ${topic.title}`);
  };

  const handleProjectPress = (project: FeaturedProjectItem): void => {
    router.push(`/p-project_detail?project_id=featured-${project.id}`);
  };

  const handleBookmarkPress = (projectId: string): void => {
    setFeaturedProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, isBookmarked: !project.isBookmarked }
          : project
      )
    );
  };

  const handleViewAllTopicsPress = (): void => {
    Alert.alert('查看全部', '查看全部话题');
  };

  const handleViewAllFeaturedPress = (): void => {
    router.push('/p-home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.appLogo}>
          <View style={styles.logoIcon}>
            <FontAwesome6 name="compass" size={16} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>发现</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchButtonPress}>
          <FontAwesome6 name="magnifying-glass" size={14} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* 搜索框 */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <FontAwesome6 name="magnifying-glass" size={14} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="搜索项目、话题或开发者"
              placeholderTextColor="#6b7280"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* 分类导航 */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>探索分类</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </View>
        </View>

        {/* 热门话题 */}
        <View style={styles.topicsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>热门话题</Text>
            <TouchableOpacity onPress={handleViewAllTopicsPress}>
              <Text style={styles.viewAllText}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.topicsList}>
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onPress={() => handleTopicPress(topic)}
              />
            ))}
          </View>
        </View>

        {/* 精选项目 */}
        <View style={styles.featuredProjectsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>精选项目</Text>
            <TouchableOpacity onPress={handleViewAllFeaturedPress}>
              <Text style={styles.viewAllText}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.featuredProjectsList}>
            {featuredProjects.map((project) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                onPress={() => handleProjectPress(project)}
                onBookmarkPress={() => handleBookmarkPress(project.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DiscoverScreen;

