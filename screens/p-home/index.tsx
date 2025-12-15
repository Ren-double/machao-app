

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import ProjectCard from './components/ProjectCard';
import TabSelector from './components/TabSelector';
import TimeFilter from './components/TimeFilter';
import CategoryFilter from './components/CategoryFilter';

interface Project {
  id: string;
  name: string;
  author: string;
  repo: string;
  description: string;
  stars: string;
  forks: string;
  language: string;
  dailyStars: string;
  isBookmarked: boolean;
}

type TabType = 'daily' | 'trending';
type TimeFilterType = 'day' | 'week' | 'month';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [currentTab, setCurrentTab] = useState<TabType>('daily');
  const [currentTimeFilter, setCurrentTimeFilter] = useState<TimeFilterType>('day');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [projectList, setProjectList] = useState<Project[]>([]);

  // 模拟项目数据
  const dailyHotProjects: Project[] = [
    {
      id: 'project-1',
      name: 'React Query',
      author: 'TanStack',
      repo: 'react-query',
      description: 'Hooks for fetching, caching and updating asynchronous data in React',
      stars: '35.2k',
      forks: '2.8k',
      language: 'JavaScript',
      dailyStars: '+1.2k',
      isBookmarked: false
    },
    {
      id: 'project-2',
      name: 'FastAPI',
      author: 'tiangolo',
      repo: 'fastapi',
      description: 'FastAPI framework, high performance, easy to learn, fast to code, ready for production',
      stars: '68.9k',
      forks: '7.2k',
      language: 'Python',
      dailyStars: '+856',
      isBookmarked: false
    },
    {
      id: 'project-3',
      name: 'Spring Boot',
      author: 'spring-projects',
      repo: 'spring-boot',
      description: 'Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications',
      stars: '69.1k',
      forks: '42.3k',
      language: 'Java',
      dailyStars: '+623',
      isBookmarked: true
    },
    {
      id: 'project-4',
      name: 'Gin',
      author: 'gin-gonic',
      repo: 'gin',
      description: 'Gin is a HTTP web framework written in Go (Golang). It features a Martini-like API',
      stars: '70.3k',
      forks: '7.8k',
      language: 'Go',
      dailyStars: '+445',
      isBookmarked: false
    },
    {
      id: 'project-5',
      name: 'Vue.js',
      author: 'vuejs',
      repo: 'vue',
      description: 'The Progressive JavaScript Framework',
      stars: '205k',
      forks: '34.2k',
      language: 'JavaScript',
      dailyStars: '+1.8k',
      isBookmarked: false
    }
  ];

  const trendingProjects: Record<TimeFilterType, Project[]> = {
    day: [
      {
        id: 'trending-1',
        name: 'TypeScript',
        author: 'microsoft',
        repo: 'TypeScript',
        description: 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.',
        stars: '94.5k',
        forks: '13.2k',
        language: 'TypeScript',
        dailyStars: '+2.1k',
        isBookmarked: false
      },
      {
        id: 'trending-2',
        name: 'Rust',
        author: 'rust-lang',
        repo: 'rust',
        description: 'Empowering everyone to build reliable and efficient software.',
        stars: '89.3k',
        forks: '12.1k',
        language: 'Rust',
        dailyStars: '+1.5k',
        isBookmarked: false
      }
    ],
    week: [
      {
        id: 'trending-3',
        name: 'TensorFlow',
        author: 'tensorflow',
        repo: 'tensorflow',
        description: 'An Open Source Machine Learning Framework for Everyone',
        stars: '184k',
        forks: '88.7k',
        language: 'C++',
        dailyStars: '+3.2k',
        isBookmarked: false
      },
      {
        id: 'trending-4',
        name: 'Swift',
        author: 'apple',
        repo: 'swift',
        description: 'The Swift Programming Language',
        stars: '64.8k',
        forks: '17.3k',
        language: 'Swift',
        dailyStars: '+987',
        isBookmarked: false
      }
    ],
    month: [
      {
        id: 'trending-5',
        name: 'Django',
        author: 'django',
        repo: 'django',
        description: 'The Web framework for perfectionists with deadlines.',
        stars: '71.2k',
        forks: '29.8k',
        language: 'Python',
        dailyStars: '+1.4k',
        isBookmarked: false
      }
    ]
  };

  useEffect(() => {
    // 解析URL参数
    if (params.selected_languages && typeof params.selected_languages === 'string') {
      setSelectedLanguages(params.selected_languages.split(','));
    }
    if (params.selected_project_types && typeof params.selected_project_types === 'string') {
      setSelectedProjectTypes(params.selected_project_types.split(','));
    }
    
    loadProjectData();
  }, [params]);

  const loadProjectData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let projects: Project[] = [];
      
      if (currentTab === 'daily') {
        projects = dailyHotProjects;
      } else {
        projects = trendingProjects[currentTimeFilter] || [];
      }
      
      // 应用筛选条件
      projects = applyFilters(projects);
      
      setProjectList(projects);
    } catch (error) {
      Alert.alert('错误', '加载项目数据失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [currentTab, currentTimeFilter, selectedLanguages, selectedProjectTypes]);

  const applyFilters = useCallback((projects: Project[]): Project[] => {
    if (selectedLanguages.length === 0 && selectedProjectTypes.length === 0) {
      return projects;
    }
    
    return projects.filter(project => {
      const languageMatch = selectedLanguages.length === 0 || 
        selectedLanguages.includes(project.language);
      
      // 项目类型筛选暂未实现，这里简化处理
      const projectTypeMatch = selectedProjectTypes.length === 0;
      
      return languageMatch && projectTypeMatch;
    });
  }, [selectedLanguages, selectedProjectTypes]);

  const handleTabChange = useCallback((tab: TabType) => {
    setCurrentTab(tab);
    setCurrentTimeFilter('day');
    loadProjectData();
  }, [loadProjectData]);

  const handleTimeFilterChange = useCallback((timeFilter: TimeFilterType) => {
    setCurrentTimeFilter(timeFilter);
    loadProjectData();
  }, [loadProjectData]);

  const handleCategoryFilterPress = useCallback(() => {
    router.push('/p-category_filter');
  }, [router]);

  const handleProfilePress = useCallback(() => {
    router.push('/p-personal_center');
  }, [router]);

  const handleProjectPress = useCallback((projectId: string) => {
    router.push(`/p-project_detail?project_id=${projectId}`);
  }, [router]);

  const handleBookmarkToggle = useCallback((projectId: string) => {
    setProjectList(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, isBookmarked: !project.isBookmarked }
          : project
      )
    );
    
    // 更新原始数据
    const updateBookmarkStatus = (projects: Project[]) =>
      projects.map(project =>
        project.id === projectId
          ? { ...project, isBookmarked: !project.isBookmarked }
          : project
      );
    
    if (currentTab === 'daily') {
      // 这里应该调用API，现在只更新本地数据
    } else {
      // 这里应该调用API，现在只更新本地数据
    }
  }, [currentTab]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadProjectData();
    setIsRefreshing(false);
  }, [loadProjectData]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      // 模拟加载更多数据
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 在实际应用中，这里会加载更多项目并添加到列表中
      console.log('加载更多项目...');
    } catch (error) {
      Alert.alert('错误', '加载更多数据失败，请重试');
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  const renderProjectItem = useCallback(({ item }: { item: Project }) => (
    <ProjectCard
      project={item}
      onPress={() => handleProjectPress(item.id)}
      onBookmarkToggle={() => handleBookmarkToggle(item.id)}
    />
  ), [handleProjectPress, handleBookmarkToggle]);

  const renderListHeader = useCallback(() => (
    <View>
      <TabSelector
        currentTab={currentTab}
        onTabChange={handleTabChange}
      />
      
      {currentTab === 'trending' && (
        <TimeFilter
          currentTimeFilter={currentTimeFilter}
          onTimeFilterChange={handleTimeFilterChange}
        />
      )}
      
      <CategoryFilter
        selectedLanguages={selectedLanguages}
        onPress={handleCategoryFilterPress}
      />
    </View>
  ), [currentTab, currentTimeFilter, selectedLanguages, handleTabChange, handleTimeFilterChange, handleCategoryFilterPress]);

  const renderListFooter = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <FontAwesome6 name="spinner" size={24} color="#2563eb" style={styles.loadingIcon} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      );
    }

    if (projectList.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <FontAwesome6 name="magnifying-glass" size={48} color="#d1d5db" />
          <Text style={styles.noDataText}>暂无符合条件的项目</Text>
        </View>
      );
    }

    return (
      <View style={styles.loadMoreContainer}>
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore && (
            <FontAwesome6 name="spinner" size={14} color="#ffffff" style={styles.loadingIcon} />
          )}
          <Text style={styles.loadMoreText}>加载更多</Text>
        </TouchableOpacity>
      </View>
    );
  }, [isLoading, projectList.length, isLoadingMore, handleLoadMore]);

  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <FontAwesome6 name="code" size={16} color="#ffffff" />
        </View>
        <Text style={styles.logoText}>码潮</Text>
      </View>
      <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
        <FontAwesome6 name="user" size={16} color="#6b7280" />
      </TouchableOpacity>
    </View>
  ), [handleProfilePress]);

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={projectList}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

