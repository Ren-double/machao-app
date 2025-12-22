

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import CategoryCard from './components/CategoryCard';
import TopicCard from './components/TopicCard';
import FeaturedProjectCard from './components/FeaturedProjectCard';
import { getHotTopics, getTrendingRepositories, GitHubProject } from '../../services/github';
import { DISCOVER_CATEGORIES } from '../../config/constants';

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
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProjectItem[]>([]);

  const categories: CategoryItem[] = DISCOVER_CATEGORIES;

  const [topics, setTopics] = useState<TopicItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadTopics(), loadFeaturedProjects()]);
  };

  const loadFeaturedProjects = async () => {
    try {
      // 获取本周趋势作为精选
      const projects = await getTrendingRepositories('weekly');
      const mappedProjects: FeaturedProjectItem[] = projects.slice(0, 5).map(p => ({
        id: p.id,
        title: p.name,
        owner: p.author,
        repo: p.repo,
        description: p.description,
        starCount: p.stars,
        forkCount: p.forks,
        language: p.language,
        languageColor: '#2563eb', // 默认蓝色
        languageBgColor: '#dbeafe',
        trendCount: p.dailyStars ? `+${p.dailyStars}` : '',
        isBookmarked: p.isBookmarked
      }));
      setFeaturedProjects(mappedProjects);
    } catch (error) {
      console.error('Failed to load featured projects', error);
    }
  };

  const loadTopics = async () => {
    try {
      const hotTopics = await getHotTopics();
      if (hotTopics.length > 0) {
        const mappedTopics: TopicItem[] = hotTopics.map((topic, index) => {
          const colors = [
             { color: '#2563eb', bg: '#dbeafe' },
             { color: '#10b981', bg: '#dcfce7' },
             { color: '#8b5cf6', bg: '#ede9fe' },
             { color: '#f59e0b', bg: '#fef3c7' },
             { color: '#ef4444', bg: '#fee2e2' },
             { color: '#06b6d4', bg: '#cffafe' },
          ];
          const colorSet = colors[index % colors.length];
          return {
            id: topic.name,
            title: `#${topic.display_name || topic.name}`,
            discussionCount: topic.short_description || '热门话题',
            tag: 'Hot',
            color: colorSet.color,
            backgroundColor: colorSet.bg
          };
        });
        setTopics(mappedTopics);
      } else {
         // Fallback to static if fetch fails or empty
         setTopics([
            { id: '1', title: '#AI编程助手', discussionCount: '1.2k 讨论 · 今日热门', tag: '今日热门', color: '#2563eb', backgroundColor: '#dbeafe' },
            { id: '2', title: '#前端框架对比', discussionCount: '856 讨论 · 本周热门', tag: '本周热门', color: '#10b981', backgroundColor: '#dcfce7' },
            { id: '3', title: '#开源贡献指南', discussionCount: '623 讨论 · 本月热门', tag: '本月热门', color: '#8b5cf6', backgroundColor: '#ede9fe' },
         ]);
      }
    } catch (error) {
       console.error('Failed to load topics', error);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (): void => {
    if (searchText.trim()) {
      router.push(`/p-home?search_keyword=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const handleSearchButtonPress = (): void => {
    handleSearch();
  };

  const handleCategoryPress = (category: CategoryItem): void => {
    if (category.id === 'more') {
      router.push('/p-home'); // 暂时跳转到首页
      return;
    }
    // 跳转到首页并搜索相关话题
    const query = `topic:${category.id}`;
    router.push(`/p-home?search_keyword=${encodeURIComponent(query)}`);
  };

  const handleTopicPress = (topic: TopicItem): void => {
    // 移除话题前的 # 号
    const keyword = topic.title.replace(/^#/, '');
    router.push(`/p-home?search_keyword=${encodeURIComponent(keyword)}`);
  };

  const handleProjectPress = (project: FeaturedProjectItem): void => {
    // 解析 repo 名称 (通常格式为 owner/name)
    const repoName = project.repo.includes('/') ? project.repo.split('/')[1] : project.repo;
    
    router.push({
      pathname: '/p-project_detail',
      params: {
        id: project.id,
        owner: project.owner,
        name: repoName
      }
    });
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
    router.push('/p-home');
  };

  const handleViewAllFeaturedPress = (): void => {
    router.push({ pathname: '/p-home', params: { tab: 'trending' } });
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
              returnKeyType="search"
              onSubmitEditing={handleSearch}
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

