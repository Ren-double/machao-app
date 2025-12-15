

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

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

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  onBookmarkToggle: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  onBookmarkToggle,
}) => {
  const getLanguageTagStyle = (language: string) => {
    const languageStyles: Record<string, any> = {
      javascript: styles.languageJavaScript,
      python: styles.languagePython,
      java: styles.languageJava,
      go: styles.languageGo,
      typescript: styles.languageTypeScript,
      rust: styles.languageRust,
      cpp: styles.languageCpp,
      swift: styles.languageSwift,
    };
    
    return languageStyles[language.toLowerCase()] || styles.languageDefault;
  };

  const handleBookmarkPress = (event: any) => {
    event.stopPropagation();
    onBookmarkToggle();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{project.name}</Text>
          <Text style={styles.subtitle}>{project.author} / {project.repo}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookmarkButton,
            project.isBookmarked ? styles.bookmarkButtonActive : styles.bookmarkButtonInactive
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
            <Text style={styles.statText}>{project.stars}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome6 name="code-branch" size={12} color="#6b7280" />
            <Text style={styles.statText}>{project.forks}</Text>
          </View>
          <View style={[styles.languageTag, getLanguageTagStyle(project.language)]}>
            <Text style={styles.languageText}>{project.language}</Text>
          </View>
        </View>
        <View style={styles.dailyStarsContainer}>
          <FontAwesome6 name="arrow-up" size={12} color="#10b981" />
          <Text style={styles.dailyStarsText}>{project.dailyStars}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProjectCard;

