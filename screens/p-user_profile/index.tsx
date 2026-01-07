import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Linking, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import { getUserDetails, getUserRepos, GitHubUserDetails, GitHubProject } from '../../services/github';
import ProjectCard from '../p-home/components/ProjectCard';
import i18n from '../../services/i18n';

const UserProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const username = params.username as string;
  const initialAvatar = params.avatar_url as string;

  const [userDetails, setUserDetails] = useState<GitHubUserDetails | null>(null);
  const [repos, setRepos] = useState<GitHubProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!username) return;
    setIsLoading(true);
    try {
      const [details, userRepos] = await Promise.all([
        getUserDetails(username),
        getUserRepos(username)
      ]);
      setUserDetails(details);
      setRepos(userRepos);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handleProjectPress = (projectId: string) => {
     const project = repos.find(p => p.id === projectId);
     if (project) {
        router.push({
          pathname: '/p-project_detail',
          params: {
            id: project.id,
            owner: project.author,
            name: project.name,
            description: project.description
          }
        });
     }
  };
  
  // Dummy handler for bookmark (read-only view mostly, but could implement bookmarking logic if needed)
  const handleBookmarkToggle = (projectId: string) => {
      // Logic to toggle bookmark
  };

  const renderHeader = () => (
    <View>
      <View style={styles.profileHeader}>
        <Image 
            source={{ uri: userDetails?.avatar_url || initialAvatar }} 
            style={styles.avatar} 
        />
        <Text style={styles.name}>{userDetails?.name || username}</Text>
        <Text style={styles.login}>@{username}</Text>
        
        {userDetails?.bio && (
            <Text style={styles.bio}>{userDetails.bio}</Text>
        )}

        {userDetails?.location && (
            <View style={styles.infoRow}>
                <FontAwesome6 name="location-dot" size={14} color="#6b7280" />
                <Text style={styles.infoText}>{userDetails.location}</Text>
            </View>
        )}
        
        {userDetails?.blog && (
            <TouchableOpacity style={styles.infoRow} onPress={() => handleLinkPress(userDetails.blog!)}>
                <FontAwesome6 name="link" size={14} color="#3b82f6" />
                <Text style={[styles.infoText, { color: '#3b82f6' }]}>{userDetails.blog}</Text>
            </TouchableOpacity>
        )}

        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={styles.statValue}>{userDetails?.public_repos || 0}</Text>
                <Text style={styles.statLabel}>Repositories</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statValue}>{userDetails?.followers || 0}</Text>
                <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statValue}>{userDetails?.following || 0}</Text>
                <Text style={styles.statLabel}>Following</Text>
            </View>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Repositories</Text>
    </View>
  );

  if (isLoading && !userDetails && !repos.length) {
      return (
          <SafeAreaView style={styles.container}>
             <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <FontAwesome6 name="chevron-left" size={16} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={styles.placeholder} />
             </View>
             <View style={styles.loadingContainer}>
                 <ActivityIndicator size="large" color="#3b82f6" />
                 <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
             </View>
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome6 name="chevron-left" size={16} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userDetails?.login || username}</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={repos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <ProjectCard 
                project={item} 
                onPress={() => handleProjectPress(item.id)}
                onBookmarkToggle={() => handleBookmarkToggle(item.id)}
            />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
            !isLoading ? <Text style={styles.emptyText}>{i18n.t('no_results')}</Text> : null
        }
      />
    </SafeAreaView>
  );
};

export default UserProfileScreen;
