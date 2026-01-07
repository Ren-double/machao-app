

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import ProjectCard from './components/ProjectCard';
import UserCard from './components/UserCard';
import TabSelector from './components/TabSelector';
import TimeFilter from './components/TimeFilter';
import CategoryFilter from './components/CategoryFilter';
import { searchRepositories, getTrendingRepositories, searchUsers, GitHubProject, GitHubUser } from '../../services/github';
import { getBookmarks, addBookmark, removeBookmark, BookmarkProject } from '../../services/bookmarks';
import i18n from '../../services/i18n';

interface Project extends GitHubProject {}

type TabType = 'daily' | 'trending';
type TimeFilterType = 'day' | 'week' | 'month';
type SearchType = 'repo' | 'user' | 'lang';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [currentTab, setCurrentTab] = useState<TabType>('daily');
  const [currentTimeFilter, setCurrentTimeFilter] = useState<TimeFilterType>('day');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('repo');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [dataList, setDataList] = useState<(Project | GitHubUser)[]>([]);

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
      let data: (Project | GitHubUser)[] = [];
      
      if (searchKeyword) {
        // 搜索模式
        if (searchType === 'user') {
          data = await searchUsers(searchKeyword);
        } else if (searchType === 'lang') {
           // 语言搜索：视为仓库搜索，但 query 加上 language:
           data = await searchRepositories(`language:${searchKeyword} ${searchKeyword}`);
        } else {
          // 默认仓库搜索
          data = await searchRepositories(searchKeyword);
        }
      } else if (currentTab === 'daily') {
        // 每日推荐 (模拟为今日热门)
        data = await getTrendingRepositories('daily');
      } else {
        // 趋势榜
        const timeMap: Record<TimeFilterType, 'daily' | 'weekly' | 'monthly'> = {
          day: 'daily',
          week: 'weekly',
          month: 'monthly'
        };
        data = await getTrendingRepositories(timeMap[currentTimeFilter]);
      }
      
      // 应用本地筛选条件 (语言) - 仅在非用户搜索且非语言搜索模式下
      if (searchType === 'repo' && selectedLanguages.length > 0) {
        data = (data as Project[]).filter(p => selectedLanguages.includes(p.language));
      }
      
      // Merge with bookmarks
      const bookmarks = await getBookmarks();
      const bookmarkedIds = new Set(bookmarks.map(b => b.id));

      const dataWithBookmarks = data.map(item => {
        if ('type' in item && 'login' in item) return item; // User
        const project = item as Project;
        return {
          ...project,
          isBookmarked: bookmarkedIds.has(project.id)
        };
      });

      setDataList(dataWithBookmarks);
    } catch (error: any) {
      if (error.message === 'RATE_LIMIT_EXCEEDED') {
        Alert.alert(i18n.t('error'), i18n.t('error')); // Should use specific error msg if available
        // 如果是速率限制，不应该清空当前列表，保留旧数据
        return;
      }
      Alert.alert(i18n.t('error'), i18n.t('error'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentTab, currentTimeFilter, selectedLanguages, selectedProjectTypes, searchKeyword, searchType]);

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

  const handleUserPress = useCallback((user: GitHubUser) => {
    router.push({
      pathname: '/p-user_profile',
      params: {
        username: user.login,
        avatar_url: user.avatar_url
      }
    });
  }, [router]);

  const handleProjectPress = useCallback((projectId: string) => {
    const project = (dataList as Project[]).find(p => p.id === projectId);
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
  }, [router, dataList]);

  const handleBookmarkToggle = useCallback(async (projectId: string) => {
    const projectIndex = (dataList as Project[]).findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;
    
    const project = (dataList as Project[])[projectIndex];
    const newStatus = !project.isBookmarked;

    // Optimistic update
    setDataList(prevData =>
      (prevData as Project[]).map(p =>
        p.id === projectId
          ? { ...p, isBookmarked: newStatus }
          : p
      )
    );

    try {
      if (newStatus) {
        await addBookmark(project as unknown as BookmarkProject);
      } else {
        await removeBookmark(projectId);
      }
    } catch (error) {
      console.error('Bookmark toggle failed', error);
      // Revert
      setDataList(prevData =>
        (prevData as Project[]).map(p =>
          p.id === projectId
            ? { ...p, isBookmarked: !newStatus }
            : p
        )
      );
      Alert.alert(i18n.t('error'), i18n.t('operation_failed'));
    }
  }, [dataList]);

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
      const nextPage = Math.floor(dataList.length / 10) + 1;
      let newItems: (Project | GitHubUser)[] = [];

      if (searchKeyword) {
        if (searchType === 'user') {
          newItems = await searchUsers(searchKeyword, nextPage);
        } else if (searchType === 'lang') {
          newItems = await searchRepositories(`language:${searchKeyword} ${searchKeyword}`, 'stars', 'desc', nextPage);
        } else {
          newItems = await searchRepositories(searchKeyword, 'stars', 'desc', nextPage);
        }
      } else {
         const timeMap: Record<TimeFilterType, 'daily' | 'weekly' | 'monthly'> = {
          day: 'daily',
          week: 'weekly',
          month: 'monthly'
        };
        // 每日推荐也使用 trending 逻辑
        const timeFilter = currentTab === 'daily' ? 'daily' : timeMap[currentTimeFilter];
        
        // 重新构建 trending 的 query
        const date = new Date();
        if (timeFilter === 'daily') date.setDate(date.getDate() - 1);
        else if (timeFilter === 'weekly') date.setDate(date.getDate() - 7);
        else date.setDate(date.getDate() - 30);
        
        const dateString = date.toISOString().split('T')[0];
        const query = `created:>${dateString}`;
        newItems = await searchRepositories(query, 'stars', 'desc', nextPage);
      }

      // 过滤掉已存在的项目
      // Note: for Users, id is number but mapped to string in searchUsers (wait, let me check github.ts)
      // In github.ts: GitHubRepo id is number, converted to string. GitHubUser id is string.
      // So checking string ID is safe.
      const existingIds = new Set(dataList.map(p => p.id));
      const uniqueNewItems = newItems.filter(p => !existingIds.has(p.id));

      if (uniqueNewItems.length > 0) {
        setDataList(prev => [...prev, ...uniqueNewItems]);
        console.log('Load more success');
      } else {
        console.log('No more data');
      }
    } catch (error) {
      console.error('Load more failed:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, dataList.length, searchKeyword, currentTab, currentTimeFilter, searchType]);

  const renderItem = useCallback(({ item }: { item: Project | GitHubUser }) => {
    if ('type' in item && 'login' in item) {
       // It's a User
       return (
         <UserCard
            user={item as GitHubUser}
            onPress={() => handleUserPress(item as GitHubUser)}
         />
       );
    }
    // It's a Project
    return (
      <ProjectCard
        project={item as Project}
        onPress={() => handleProjectPress(item.id)}
        onBookmarkToggle={() => handleBookmarkToggle(item.id)}
      />
    );
  }, [handleProjectPress, handleBookmarkToggle, handleUserPress]);

  const handleClearSearch = useCallback(() => {
    router.setParams({ search_keyword: '' });
    setSearchKeyword('');
  }, [router]);

  const renderListHeader = useCallback(() => (
    <View>
      {searchKeyword ? (
        <View>
          <View style={styles.searchHeader}>
            <Text style={styles.searchHeaderText}>
              {i18n.t('search_results', { query: searchKeyword })}
            </Text>
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearSearchButton}>
              <Text style={styles.clearSearchText}>{i18n.t('clear_search')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchTypeContainer}>
            {(['repo', 'user', 'lang'] as SearchType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.searchTypeButton,
                  searchType === type && styles.searchTypeButtonActive
                ]}
                onPress={() => setSearchType(type)}
              >
                <Text style={[
                  styles.searchTypeText,
                  searchType === type && styles.searchTypeTextActive
                ]}>
                  {i18n.t(`search_type_${type}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
      
      {(currentTab === 'daily' || searchKeyword) && (
        <CategoryFilter
          selectedLanguages={selectedLanguages}
          onPress={handleCategoryFilterPress}
        />
      )}
    </View>
  ), [searchKeyword, currentTab, currentTimeFilter, selectedLanguages, selectedProjectTypes, searchType, handleClearSearch, handleTabChange, handleTimeFilterChange, handleCategoryFilterPress]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <FontAwesome6 name="github" size={20} color="#fff" />
          </View>
          <Text style={styles.logoText}>GitTrend</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <FontAwesome6 name="user" size={16} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#2563eb']} tintColor="#2563eb" />
        }
        ListHeaderComponent={renderListHeader}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View>
            {isLoading && !isRefreshing && (
              <View style={styles.loadingContainer}>
                <FontAwesome6 name="spinner" size={24} color="#2563eb" style={styles.loadingIcon} />
                <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
              </View>
            )}
            {isLoadingMore && (
              <View style={styles.loadMoreContainer}>
                <FontAwesome6 name="spinner" size={20} color="#2563eb" style={styles.loadingIcon} />
                <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
              </View>
            )}
            {!isLoading && !isLoadingMore && dataList.length > 0 && (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>{i18n.t('no_more_data')}</Text>
              </View>
            )}
            {!isLoading && dataList.length === 0 && (
              <View style={styles.noDataContainer}>
                <FontAwesome6 name="box-open" size={48} color="#9ca3af" />
                <Text style={styles.noDataText}>{i18n.t('no_results')}</Text>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

