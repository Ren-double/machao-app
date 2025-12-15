

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
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
  
  const [historyData, setHistoryData] = useState<HistoryItem[]>([
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
      timeAgo: '2分钟前',
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
      timeAgo: '15分钟前',
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
      timeAgo: '1小时前',
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
      timeAgo: '2小时前',
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
      timeAgo: '3小时前',
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
      timeAgo: '昨天',
    },
  ]);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setTimeout(() => {
      setHistoryData([]);
      setIsClearModalVisible(false);
      setIsLoading(false);
      Alert.alert('提示', '浏览历史已清空');
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
      Alert.alert('提示', '刷新成功');
    }, 1500);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setIsLoadingMore(false);
      Alert.alert('提示', '已加载更多历史记录');
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
      <Text style={styles.emptyStateTitle}>暂无浏览历史</Text>
      <Text style={styles.emptyStateDescription}>去发现页面看看有什么有趣的项目吧</Text>
      <TouchableOpacity style={styles.goDiscoverButton} onPress={handleGoDiscover}>
        <Text style={styles.goDiscoverButtonText}>去发现</Text>
      </TouchableOpacity>
    </View>
  ), [handleGoDiscover]);

  const renderLoadingState = useCallback(() => (
    <View style={styles.loadingStateContainer}>
      <View style={styles.loadingSpinner} />
      <Text style={styles.loadingStateText}>加载中...</Text>
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
          <Text style={styles.loadMoreButtonText}>加载更多</Text>
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
            <Text style={styles.headerTitle}>浏览历史</Text>
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
          <Text style={styles.headerTitle}>浏览历史</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistoryPress}>
          <FontAwesome6 name="trash" size={12} color="#ffffff" style={styles.clearButtonIcon} />
          <Text style={styles.clearButtonText}>清空</Text>
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
            <Text style={styles.modalTitle}>清空浏览历史</Text>
            <Text style={styles.modalDescription}>确定要清空所有浏览历史吗？此操作不可恢复。</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelClear}>
                <Text style={styles.modalCancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirmClear}>
                <Text style={styles.modalConfirmButtonText}>确定清空</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BrowseHistoryScreen;

