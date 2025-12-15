

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import ProjectCard from './components/ProjectCard';
import styles from './styles';

interface Project {
  id: string;
  title: string;
  owner: string;
  repo: string;
  description: string;
  stars: string;
  forks: string;
  language: string;
  languageColor: string;
  languageBg: string;
  collectedAt: string;
}

const MyCollectionsScreen = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [collectionProjects, setCollectionProjects] = useState<Project[]>([
    {
      id: 'react-query',
      title: 'React Query',
      owner: 'TanStack',
      repo: 'react-query',
      description: 'Hooks for fetching, caching and updating asynchronous data in React',
      stars: '35.2k',
      forks: '2.8k',
      language: 'JavaScript',
      languageColor: '#92400e',
      languageBg: '#fef3c7',
      collectedAt: '2天前',
    },
    {
      id: 'fastapi',
      title: 'FastAPI',
      owner: 'tiangolo',
      repo: 'fastapi',
      description: 'FastAPI framework, high performance, easy to learn, fast to code, ready for production',
      stars: '68.9k',
      forks: '7.2k',
      language: 'Python',
      languageColor: '#1e40af',
      languageBg: '#dbeafe',
      collectedAt: '3天前',
    },
    {
      id: 'spring-boot',
      title: 'Spring Boot',
      owner: 'spring-projects',
      repo: 'spring-boot',
      description: 'Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications',
      stars: '69.1k',
      forks: '42.3k',
      language: 'Java',
      languageColor: '#166534',
      languageBg: '#dcfce7',
      collectedAt: '1周前',
    },
    {
      id: 'rust',
      title: 'Rust',
      owner: 'rust-lang',
      repo: 'rust',
      description: 'Empowering everyone to build reliable and efficient software.',
      stars: '88.5k',
      forks: '13.2k',
      language: 'Rust',
      languageColor: '#5b21b6',
      languageBg: '#f3e8ff',
      collectedAt: '2周前',
    },
    {
      id: 'vue',
      title: 'Vue.js',
      owner: 'vuejs',
      repo: 'vue',
      description: 'The Progressive JavaScript Framework',
      stars: '205k',
      forks: '34.2k',
      language: 'JavaScript',
      languageColor: '#92400e',
      languageBg: '#fef3c7',
      collectedAt: '3周前',
    },
  ]);

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleEditPress = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const handleProjectPress = useCallback((projectId: string) => {
    router.push(`/p-project_detail?projectId=${projectId}`);
  }, [router]);

  const handleBookmarkPress = useCallback((projectId: string) => {
    Alert.alert(
      '取消收藏',
      '确定要取消收藏这个项目吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            setCollectionProjects(prevProjects =>
              prevProjects.filter(project => project.id !== projectId)
            );
          },
        },
      ]
    );
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    // 模拟加载更多数据
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1500);
  }, [isLoadingMore]);

  const handleGoDiscover = useCallback(() => {
    router.push('/p-home');
  }, [router]);

  const renderProjectItem = useCallback(({ item }: { item: Project }) => (
    <ProjectCard
      project={item}
      onPress={() => handleProjectPress(item.id)}
      onBookmarkPress={() => handleBookmarkPress(item.id)}
    />
  ), [handleProjectPress, handleBookmarkPress]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome6 name="arrow-left" size={14} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的收藏</Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.collectionCount}>共 {collectionProjects.length} 个</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Text style={styles.editButtonText}>{isEditing ? '完成' : '编辑'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [collectionProjects.length, isEditing, handleBackPress, handleEditPress]);

  const renderFooter = useCallback(() => {
    if (collectionProjects.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIcon}>
            <FontAwesome6 name="heart" size={24} color="#6b7280" />
          </View>
          <Text style={styles.emptyStateTitle}>暂无收藏项目</Text>
          <Text style={styles.emptyStateDescription}>去发现页面寻找你感兴趣的项目吧</Text>
          <TouchableOpacity style={styles.goDiscoverButton} onPress={handleGoDiscover}>
            <Text style={styles.goDiscoverButtonText}>去发现</Text>
          </TouchableOpacity>
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
            <FontAwesome6 name="spinner" size={12} color="#ffffff" style={styles.loadingIcon} />
          )}
          <Text style={styles.loadMoreButtonText}>加载更多</Text>
        </TouchableOpacity>
      </View>
    );
  }, [collectionProjects.length, isLoadingMore, handleLoadMore, handleGoDiscover]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={collectionProjects}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
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

export default MyCollectionsScreen;

