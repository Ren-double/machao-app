

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../services/i18n';
import HistoryCard from './components/HistoryCard';
import styles from './styles';

interface HistoryItem {
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
  timeAgo: string;
}

const BrowseHistoryScreen = () => {
  const router = useRouter();
  
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  
  // 默认数据，用于首次初始化
  const defaultHistoryData: HistoryItem[] = [
    {
      id: 'project-1',
      title: 'React Query',
      owner: 'TanStack',
      repo: 'react-query',
      description: 'Hooks for fetching, caching and updating asynchronous data in React',
      stars: '35.2k',
      forks: '2.8k',
      language: 'JavaScript',
      languageColor: '#92400e',
      languageBg: '#fef3c7',
      timeAgo: i18n.t('minutes_ago', {count: 2}),
    },
    {
      id: 'project-2',
      title: 'FastAPI',
      owner: 'tiangolo',
      repo: 'fastapi',
      description: 'FastAPI framework, high performance, easy to learn, fast to code, ready for production',
      stars: '68.9k',
      forks: '7.2k',
      language: 'Python',
      languageColor: '#1e40af',
      languageBg: '#dbeafe',
      timeAgo: i18n.t('minutes_ago', {count: 15}),
    },
    {
      id: 'project-3',
      title: 'Spring Boot',
      owner: 'spring-projects',
      repo: 'spring-boot',
      description: 'Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications',
      stars: '69.1k',
      forks: '42.3k',
      language: 'Java',
      languageColor: '#166534',
      languageBg: '#dcfce7',
      timeAgo: i18n.t('hours_ago', {count: 1}),
    },
    {
      id: 'project-4',
      title: 'Gin',
      owner: 'gin-gonic',
      repo: 'gin',
      description: 'Gin is a HTTP web framework written in Go (Golang). It features a Martini-like API',
      stars: '70.3k',
      forks: '7.8k',
      language: 'Go',
      languageColor: '#991b1b',
      languageBg: '#fef2f2',
      timeAgo: i18n.t('hours_ago', {count: 2}),
    },
    {
      id: 'project-5',
      title: 'Vue.js',
      owner: 'vuejs',
      repo: 'vue',
      description: 'The Progressive JavaScript Framework',
      stars: '205k',
      forks: '34.2k',
      language: 'JavaScript',
      languageColor: '#92400e',
      languageBg: '#fef3c7',
      timeAgo: i18n.t('hours_ago', {count: 3}),
    },
    {
      id: 'project-6',
      title: 'TypeScript',
      owner: 'microsoft',
      repo: 'TypeScript',
      description: 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.',
      stars: '96.8k',
      forks: '14.2k',
      language: 'TypeScript',
      languageColor: '#3730a3',
      languageBg: '#e0e7ff',
      timeAgo: i18n.t('yesterday'),
    },
  ];
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadHistoryData();
    }, [])
  );

  const loadHistoryData = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('@browseHistory');
      if (savedHistory !== null) {
        setHistoryData(JSON.parse(savedHistory));
      } else {
        // 首次初始化
        setHistoryData(defaultHistoryData);
        await AsyncStorage.setItem('@browseHistory', JSON.stringify(defaultHistoryData));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleClearHistoryPress = useCallback(() => {
    setIsClearModalVisible(true);
  }, []);

  const handleConfirmClear = useCallback(() => {
    setIsLoading(true);
    setTimeout(async () => {
      setHistoryData([]);
      await AsyncStorage.setItem('@browseHistory', JSON.stringify([]));
      setIsClearModalVisible(false);
      setIsLoading(false);
      Alert.alert(i18n.t('success'), i18n.t('clear_success'));
    }, 500);
  }, []);

  const handleCancelClear = useCallback(() => {
    setIsClearModalVisible(false);
  }, []);

  const handleHistoryCardPress = useCallback((projectId: string) => {
    router.push(`/p-project_detail?projectId=${projectId}`);
  }, [router]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      Alert.alert(i18n.t('success'), i18n.t('refresh_success'));
    }, 1500);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setIsLoadingMore(false);
      Alert.alert(i18n.t('success'), i18n.t('load_more_success'));
    }, 1500);
  }, [isLoadingMore]);

  const handleGoDiscover = useCallback(() => {
    router.push('/p-home');
  }, [router]);

  const renderHistoryItem = useCallback(({ item }: { item: HistoryItem }) => (
    <HistoryCard
      item={item}
      onPress={() => handleHistoryCardPress(item.id)}
    />
  ), [handleHistoryCardPress]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyStateContainer}>
      <FontAwesome6 name="clock-rotate-left" size={60} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>{i18n.t('empty_history')}</Text>
      <Text style={styles.emptyStateDescription}>{i18n.t('empty_history_desc')}</Text>
      <TouchableOpacity style={styles.goDiscoverButton} onPress={handleGoDiscover}>
        <Text style={styles.goDiscoverButtonText}>{i18n.t('go_discover_button')}</Text>
      </TouchableOpacity>
    </View>
  ), [handleGoDiscover]);

  const renderLoadingState = useCallback(() => (
    <View style={styles.loadingStateContainer}>
      <View style={styles.loadingSpinner} />
      <Text style={styles.loadingStateText}>{i18n.t('loading')}</Text>
    </View>
  ), []);

  const renderListFooter = useCallback(() => {
    if (historyData.length === 0) return null;
    
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
          <Text style={styles.loadMoreButtonText}>{i18n.t('load_more')}</Text>
        </TouchableOpacity>
      </View>
    );
  }, [historyData.length, isLoadingMore, handleLoadMore]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <FontAwesome6 name="arrow-left" size={14} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{i18n.t('p_browse_history')}</Text>
          </View>
        </View>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome6 name="arrow-left" size={14} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{i18n.t('p_browse_history')}</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistoryPress}>
          <FontAwesome6 name="trash" size={12} color="#ffffff" style={styles.clearButtonIcon} />
          <Text style={styles.clearButtonText}>{i18n.t('clear')}</Text>
        </TouchableOpacity>
      </View>

      {historyData.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={historyData}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
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
          ListFooterComponent={renderListFooter}
        />
      )}

      <Modal
        visible={isClearModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelClear}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{i18n.t('clear_history_title')}</Text>
            <Text style={styles.modalDescription}>{i18n.t('clear_history_confirm')}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelClear}>
                <Text style={styles.modalCancelButtonText}>{i18n.t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirmClear}>
                <Text style={styles.modalConfirmButtonText}>{i18n.t('confirm_clear')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BrowseHistoryScreen;

