

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

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

interface FeaturedProjectCardProps {
  project: FeaturedProjectItem;
  onPress: () => void;
  onBookmarkPress: () => void;
}

const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
  project,
  onPress,
  onBookmarkPress,
}) => {
  const handleBookmarkPress = (): void => {
    onBookmarkPress();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.repoPath}>{project.owner} / {project.repo}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookmarkButton,
            project.isBookmarked && styles.bookmarkButtonActive,
          ]}
          onPress={handleBookmarkPress}
        >
          <FontAwesome6
            name="bookmark"
            size={14}
            color={project.isBookmarked ? '#ffffff' : '#6b7280'}
            solid={project.isBookmarked}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {project.description}
      </Text>
      <View style={styles.footer}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome6 name="star" size={12} color="#f59e0b" solid />
            <Text style={styles.statText}>{project.starCount}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome6 name="code-branch" size={12} color="#6b7280" />
            <Text style={styles.statText}>{project.forkCount}</Text>
          </View>
          <View
            style={[
              styles.languageTag,
              { backgroundColor: project.languageBgColor },
            ]}
          >
            <Text style={[styles.languageText, { color: project.languageColor }]}>
              {project.language}
            </Text>
          </View>
        </View>
        <View style={styles.trendContainer}>
          <FontAwesome6 name="arrow-up" size={12} color="#10b981" />
          <Text style={styles.trendText}>{project.trendCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FeaturedProjectCard;

