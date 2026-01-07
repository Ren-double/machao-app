

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../services/i18n';
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
  const [collectionProjects, setCollectionProjects] = useState<Project[]>([]);

  // 默认数据，用于首次初始化
  const defaultCollectionProjects: Project[] = [
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
      collectedAt: i18n.t('just_now'),
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
      collectedAt: i18n.t('just_now'),
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
      collectedAt: i18n.t('just_now'),
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
      collectedAt: i18n.t('just_now'),
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
      collectedAt: i18n.t('just_now'),
    },
  ];

  useFocusEffect(
    useCallback(() => {
      loadCollectionData();
    }, [])
  );

  const loadCollectionData = async () => {
    try {
      const savedCollections = await AsyncStorage.getItem('@bookmarked_projects');
      if (savedCollections !== null) {
        const parsedData = JSON.parse(savedCollections);
        // Map data to match local interface if needed
        const mappedData = parsedData.map((item: any) => ({
          id: item.id,
          title: item.name || item.title,
          owner: item.author || item.owner,
          repo: item.repo,
          description: item.description,
          stars: item.stars,
          forks: item.forks,
          language: item.language,
          languageColor: item.languageColor || '#6b7280',
          languageBg: item.languageBg || '#f3f4f6',
          collectedAt: item.collectedAt || i18n.t('just_now'),
        }));
        setCollectionProjects(mappedData);
      } else {
        setCollectionProjects([]);
      }
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  };

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleEditPress = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const handleProjectPress = useCallback((projectId: string) => {
    const project = collectionProjects.find(p => p.id === projectId);
    if (project) {
        router.push({
            pathname: '/p-project_detail',
            params: {
                id: project.id,
                owner: project.owner,
                name: project.title, // or repo name? usually name is repo name
            }
        });
    }
  }, [router, collectionProjects]);

  const handleBookmarkPress = useCallback((projectId: string) => {
    Alert.alert(
      i18n.t('unfavorite_confirm_title'),
      i18n.t('unfavorite_confirm_desc'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('confirm'),
          style: 'destructive',
          onPress: async () => {
            const newProjects = collectionProjects.filter(project => project.id !== projectId);
            setCollectionProjects(newProjects);
            try {
              // We need to save the original structure if possible, but here we only have mapped structure.
              // Ideally we should filter the original list from AsyncStorage, but for now we save what we have.
              // Warning: This might lose fields not present in local interface if we overwrite.
              // Better approach: Read, Filter, Save.
              const savedCollections = await AsyncStorage.getItem('@bookmarked_projects');
              if (savedCollections) {
                  const parsed = JSON.parse(savedCollections);
                  const newSaved = parsed.filter((p: any) => p.id !== projectId);
                  await AsyncStorage.setItem('@bookmarked_projects', JSON.stringify(newSaved));
              }
            } catch (error) {
              console.error('Failed to save collections:', error);
            }
          },
        },
      ]
    );
  }, [collectionProjects]);

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
        <Text style={styles.headerTitle}>{i18n.t('my_collections')}</Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.collectionCount}>{i18n.t('collection_count', { count: collectionProjects.length })}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Text style={styles.editButtonText}>{isEditing ? i18n.t('done') : i18n.t('edit')}</Text>
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
          <Text style={styles.emptyStateTitle}>{i18n.t('no_collections')}</Text>
          <Text style={styles.emptyStateDescription}>{i18n.t('go_discover_desc')}</Text>
          <TouchableOpacity style={styles.goDiscoverButton} onPress={handleGoDiscover}>
            <Text style={styles.goDiscoverButtonText}>{i18n.t('go_discover')}</Text>
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
          <Text style={styles.loadMoreButtonText}>{i18n.t('load_more')}</Text>
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

