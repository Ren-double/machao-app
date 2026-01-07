import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image, Keyboard, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import i18n from '../../services/i18n';
import { searchRepositories, searchUsers, GitHubProject, GitHubUser } from '../../services/github';
import ProjectCard from '../p-home/components/ProjectCard';

type SearchType = 'repo' | 'user' | 'lang';

const SEARCH_HISTORY_KEY = '@search_history';

const SearchScreen = () => {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchType>('repo');
  const [repoResults, setRepoResults] = useState<GitHubProject[]>([]);
  const [userResults, setUserResults] = useState<GitHubUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    loadSearchHistory();
    // Auto focus input
    setTimeout(() => {
        inputRef.current?.focus();
    }, 100);
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Failed to load search history', error);
    }
  };

  const saveSearchHistory = async (newQuery: string) => {
    if (!newQuery.trim()) return;
    try {
      const newHistory = [
        newQuery,
        ...searchHistory.filter(item => item !== newQuery)
      ].slice(0, 10); // Keep last 10
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save search history', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
      setSearchHistory([]);
    } catch (error) {
      console.error('Failed to clear history', error);
    }
  };

  const handleSearch = async (text: string = query) => {
    if (!text.trim()) return;
    
    setQuery(text);
    setShowHistory(false);
    setIsLoading(true);
    Keyboard.dismiss();
    saveSearchHistory(text);

    try {
      if (activeTab === 'user') {
        const results = await searchUsers(text);
        setUserResults(results);
      } else if (activeTab === 'lang') {
        // Search repos with language qualifier
        const results = await searchRepositories(`language:${text}`);
        setRepoResults(results);
      } else {
        // Default repo search
        const results = await searchRepositories(text);
        setRepoResults(results);
      }
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: SearchType) => {
    setActiveTab(tab);
    if (query && !showHistory) {
        // Re-trigger search with new tab if we have a query and are not showing history
        // Use timeout to allow state update
        setTimeout(() => handleSearch(query), 0);
    }
  };

  const handleProjectPress = (projectId: string) => {
    router.push({
      pathname: '/p-project_detail',
      params: { id: projectId }
    });
  };
  
  const handleUserPress = (user: GitHubUser) => {
      // For now, open user profile in browser or we could create a user profile screen
      // Since we don't have a user profile screen in the file list (except personal_center), 
      // let's open in browser or just show an alert/toast
      Linking.openURL(user.html_url);
  };

  const renderRepoItem = ({ item }: { item: GitHubProject }) => (
    <ProjectCard
      project={item}
      onPress={() => handleProjectPress(item.id)}
      onBookmarkToggle={() => {}} // Read-only for now or implement bookmarking
    />
  );

  const renderUserItem = ({ item }: { item: GitHubUser }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item)}>
      <Image source={{ uri: item.avatar_url }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.login}</Text>
        <Text style={styles.userType}>{item.type}</Text>
      </View>
      <FontAwesome6 name="chevron-right" size={14} color="#cbd5e1" style={styles.arrowIcon} />
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
        style={styles.historyItem} 
        onPress={() => handleSearch(item)}
    >
      <FontAwesome6 name="clock-rotate-left" size={16} color="#94a3b8" />
      <Text style={styles.historyText}>{item}</Text>
      <TouchableOpacity onPress={async () => {
          const newHistory = searchHistory.filter(h => h !== item);
          setSearchHistory(newHistory);
          await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      }}>
        <FontAwesome6 name="xmark" size={14} color="#cbd5e1" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome6 name="chevron-left" size={18} color="#1e293b" />
          </TouchableOpacity>
          
          <View style={styles.searchWrapper}>
            <FontAwesome6 name="magnifying-glass" size={14} color="#94a3b8" style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              value={query}
              onChangeText={(text) => {
                  setQuery(text);
                  if (!text) setShowHistory(true);
              }}
              placeholder={i18n.t('search_placeholder')}
              placeholderTextColor="#94a3b8"
              returnKeyType="search"
              onSubmitEditing={() => handleSearch()}
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => {
                  setQuery('');
                  setShowHistory(true);
                  inputRef.current?.focus();
              }} style={styles.clearButton}>
                <FontAwesome6 name="circle-xmark" size={14} color="#cbd5e1" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={() => handleSearch()} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>{i18n.t('search')}</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'repo' && styles.activeTab]}
            onPress={() => handleTabChange('repo')}
          >
            <Text style={[styles.tabText, activeTab === 'repo' && styles.activeTabText]}>
              {i18n.t('search_type_repo')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'user' && styles.activeTab]}
            onPress={() => handleTabChange('user')}
          >
            <Text style={[styles.tabText, activeTab === 'user' && styles.activeTabText]}>
              {i18n.t('search_type_user')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'lang' && styles.activeTab]}
            onPress={() => handleTabChange('lang')}
          >
            <Text style={[styles.tabText, activeTab === 'lang' && styles.activeTabText]}>
              {i18n.t('search_type_lang')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
          </View>
        ) : showHistory && searchHistory.length > 0 ? (
          <View>
             <View style={styles.historyHeader}>
                 <Text style={styles.historyTitle}>{i18n.t('browse_history')}</Text>
                 <TouchableOpacity onPress={clearHistory}>
                     <FontAwesome6 name="trash-can" size={14} color="#64748b" />
                 </TouchableOpacity>
             </View>
             <FlatList
                data={searchHistory}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item}
             />
          </View>
        ) : activeTab === 'user' ? (
          <FlatList
            data={userResults}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 12 }}
            ListEmptyComponent={
              !showHistory && !isLoading ? (
                <View style={styles.emptyContainer}>
                  <FontAwesome6 name="magnifying-glass" size={48} color="#e2e8f0" />
                  <Text style={styles.emptyText}>{i18n.t('no_results')}</Text>
                </View>
              ) : null
            }
          />
        ) : (
          <FlatList
            data={repoResults}
            renderItem={renderRepoItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 12 }}
            ListEmptyComponent={
              !showHistory && !isLoading ? (
                <View style={styles.emptyContainer}>
                  <FontAwesome6 name="magnifying-glass" size={48} color="#e2e8f0" />
                  <Text style={styles.emptyText}>{i18n.t('no_results')}</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
