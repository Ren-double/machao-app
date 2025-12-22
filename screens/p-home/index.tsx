

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
import { searchRepositories, getTrendingRepositories, GitHubProject } from '../../services/github';

interface Project extends GitHubProject {}

type TabType = 'daily' | 'trending';
type TimeFilterType = 'day' | 'week' | 'month';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [currentTab, setCurrentTab] = useState<TabType>('daily');
  const [currentTimeFilter, setCurrentTimeFilter] = useState<TimeFilterType>('day');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [projectList, setProjectList] = useState<Project[]>([]);

  // 模拟项目数据
  // const dailyHotProjects: Project[] = []; // Removed mock data
  // const trendingProjects: Record<TimeFilterType, Project[]> = { ... }; // Removed mock data


  useEffect(() => {
    // 解析URL参数
    if (params.selected_languages && typeof params.selected_languages === 'string') {
      const languages = params.selected_languages.split(',').filter(l => l.trim() !== '');
      setSelectedLanguages(languages);
    } else {
      // 如果没有参数，清空选择 (应对从筛选页取消所有选择的情况)
      // 注意：这里可能会导致初始加载时的竞态，但结合下面的防抖应该没事
      if (params.selected_languages === '') {
         setSelectedLanguages([]);
      }
    }

    if (params.selected_project_types && typeof params.selected_project_types === 'string') {
      const types = params.selected_project_types.split(',').filter(t => t.trim() !== '');
      setSelectedProjectTypes(types);
    } else {
       if (params.selected_project_types === '') {
         setSelectedProjectTypes([]);
       }
    }

    if (params.search_keyword && typeof params.search_keyword === 'string') {
      setSearchKeyword(params.search_keyword);
    } else {
      setSearchKeyword('');
    }
    
    // 延迟加载以确保状态更新完成
    // 使用 setTimeout 避免在渲染期间直接触发副作用导致的循环
    const timer = setTimeout(() => {
        loadProjectData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [params.search_keyword, params.selected_languages, params.selected_project_types]);

  const loadProjectData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      let projects: Project[] = [];
      
      if (searchKeyword) {
        // 搜索模式
        projects = await searchRepositories(searchKeyword);
      } else if (currentTab === 'daily') {
        // 每日推荐 (模拟为今日热门)
        projects = await getTrendingRepositories('daily');
      } else {
        // 趋势榜
        const timeMap: Record<TimeFilterType, 'daily' | 'weekly' | 'monthly'> = {
          day: 'daily',
          week: 'weekly',
          month: 'monthly'
        };
        projects = await getTrendingRepositories(timeMap[currentTimeFilter]);
      }
      
      // 应用本地筛选条件 (语言)
      if (selectedLanguages.length > 0) {
        projects = projects.filter(p => selectedLanguages.includes(p.language));
      }
      
      setProjectList(projects);
    } catch (error: any) {
      if (error.message === 'RATE_LIMIT_EXCEEDED') {
        Alert.alert('提示', '访问过于频繁，请稍后再试');
        // 如果是速率限制，不应该清空当前列表，保留旧数据
        return;
      }
      Alert.alert('错误', '加载项目数据失败，请重试');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentTab, currentTimeFilter, selectedLanguages, selectedProjectTypes, searchKeyword]);

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
    router.push({
      pathname: '/p-category_filter',
      params: {
        selected_languages: selectedLanguages.join(','),
        selected_project_types: selectedProjectTypes.join(',')
      }
    });
  }, [router, selectedLanguages, selectedProjectTypes]);

  const handleProfilePress = useCallback(() => {
    router.push('/p-personal_center');
  }, [router]);

  const handleProjectPress = useCallback((projectId: string) => {
    const project = projectList.find(p => p.id === projectId);
    if (project) {
      router.push({
        pathname: '/p-project_detail',
        params: {
          id: project.id,
          owner: project.author,
          name: project.name,
          description: project.description // Optional: pass description for immediate display if needed
        }
      });
    }
  }, [router, projectList]);

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
      // 加载更多数据
      // 注意：这里为了简化，仍然使用搜索API，但在实际应用中应该使用分页参数
      // 由于 GitHub API 限制和分页逻辑的复杂性，这里暂时只演示加载逻辑
      // 实际项目中需要维护 page 状态
      
      const nextPage = Math.floor(projectList.length / 10) + 1;
      let newProjects: Project[] = [];

      if (searchKeyword) {
        newProjects = await searchRepositories(searchKeyword, 'stars', 'desc', nextPage);
      } else {
         const timeMap: Record<TimeFilterType, 'daily' | 'weekly' | 'monthly'> = {
          day: 'daily',
          week: 'weekly',
          month: 'monthly'
        };
        // 每日推荐也使用 trending 逻辑
        const timeFilter = currentTab === 'daily' ? 'daily' : timeMap[currentTimeFilter];
        // 对于 trending，我们简单地再次调用（实际应该有分页逻辑，这里 GitHub API 模拟 trending 也是用的 search）
        // 简单起见，我们假设 searchRepositories 支持分页，我们传递分页参数
        // 但 getTrendingRepositories 内部调用 searchRepositories 时已经写死了参数
        // 为了支持分页，我们需要修改 getTrendingRepositories 或直接调用 searchRepositories
        
        // 重新构建 trending 的 query
        const date = new Date();
        if (timeFilter === 'daily') date.setDate(date.getDate() - 1);
        else if (timeFilter === 'weekly') date.setDate(date.getDate() - 7);
        else date.setDate(date.getDate() - 30);
        
        const dateString = date.toISOString().split('T')[0];
        const query = `created:>${dateString}`;
        newProjects = await searchRepositories(query, 'stars', 'desc', nextPage);
      }

      // 过滤掉已存在的项目
      const existingIds = new Set(projectList.map(p => p.id));
      const uniqueNewProjects = newProjects.filter(p => !existingIds.has(p.id));

      if (uniqueNewProjects.length > 0) {
        setProjectList(prev => [...prev, ...uniqueNewProjects]);
        console.log('加载更多项目成功');
      } else {
        console.log('没有更多数据了');
      }
    } catch (error) {
      console.error('加载更多失败:', error);
      // 不弹窗打扰用户，只是 console log
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, projectList.length, searchKeyword, currentTab, currentTimeFilter]);

  const renderProjectItem = useCallback(({ item }: { item: Project }) => (
    <ProjectCard
      project={item}
      onPress={() => handleProjectPress(item.id)}
      onBookmarkToggle={() => handleBookmarkToggle(item.id)}
    />
  ), [handleProjectPress, handleBookmarkToggle]);

  const handleClearSearch = useCallback(() => {
    router.setParams({ search_keyword: '' });
    setSearchKeyword('');
  }, [router]);

  const renderListHeader = useCallback(() => (
    <View>
      {searchKeyword ? (
        <View style={styles.searchHeader}>
          <Text style={styles.searchHeaderText}>
            "{searchKeyword}" 的搜索结果
          </Text>
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearSearchButton}>
            <Text style={styles.clearSearchText}>清除搜索</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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
        </>
      )}
      
      <CategoryFilter
        selectedLanguages={selectedLanguages}
        onPress={() => {
          router.push({
            pathname: '/p-category_filter',
            params: {
              selected_languages: selectedLanguages.join(','),
              selected_project_types: selectedProjectTypes.join(',')
            }
          });
        }}
      />
    </View>
  ), [currentTab, currentTimeFilter, selectedLanguages, handleTabChange, handleTimeFilterChange, handleCategoryFilterPress, searchKeyword, handleClearSearch]);

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

