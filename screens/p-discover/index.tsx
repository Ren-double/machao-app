

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import i18n from '../../services/i18n';
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
            discussionCount: topic.short_description || i18n.t('hot_topic_default'),
            tag: 'Hot',
            color: colorSet.color,
            backgroundColor: colorSet.bg
          };
        });
        setTopics(mappedTopics);
      } else {
         // Fallback to static if fetch fails or empty
         setTopics([
            { 
              id: '1', 
              title: i18n.t('topic_ai_assistant'), 
              discussionCount: i18n.t('topic_discussion_count', { amount: '1.2k', tag: i18n.t('topic_hot_today') }), 
              tag: i18n.t('topic_hot_today'), 
              color: '#2563eb', 
              backgroundColor: '#dbeafe' 
            },
            { 
              id: '2', 
              title: i18n.t('topic_frontend_frameworks'), 
              discussionCount: i18n.t('topic_discussion_count', { amount: '856', tag: i18n.t('topic_hot_week') }), 
              tag: i18n.t('topic_hot_week'), 
              color: '#10b981', 
              backgroundColor: '#dcfce7' 
            },
            { 
              id: '3', 
              title: i18n.t('topic_open_source_guide'), 
              discussionCount: i18n.t('topic_discussion_count', { amount: '623', tag: i18n.t('topic_hot_month') }), 
              tag: i18n.t('topic_hot_month'),  
              color: '#8b5cf6', 
              backgroundColor: '#ede9fe' 
            },
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
      console.error(i18n.t('load_failed'), error);
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
          <Text style={styles.headerTitle}>{i18n.t('p_discover')}</Text>
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
              placeholder={i18n.t('search_placeholder_discover')}
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
          <Text style={styles.sectionTitle}>{i18n.t('explore_categories')}</Text>
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
            <Text style={styles.sectionTitle}>{i18n.t('hot_topics')}</Text>
            <TouchableOpacity onPress={handleViewAllTopicsPress}>
              <Text style={styles.viewAllText}>{i18n.t('view_all')}</Text>
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
            <Text style={styles.sectionTitle}>{i18n.t('featured')}</Text>
            <TouchableOpacity onPress={handleViewAllFeaturedPress}>
              <Text style={styles.viewAllText}>{i18n.t('view_all')}</Text>
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

