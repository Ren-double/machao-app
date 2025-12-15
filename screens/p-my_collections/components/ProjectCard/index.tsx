

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
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

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  onBookmarkPress: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  onBookmarkPress,
}) => {
  const handleBookmarkPress = (event: any) => {
    event.stopPropagation();
    onBookmarkPress();
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <Text style={styles.projectRepo}>{project.owner} / {project.repo}</Text>
        </View>
        <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmarkPress}>
          <FontAwesome6 name="bookmark" size={14} color="#2563eb" solid />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.projectDescription} numberOfLines={2}>
        {project.description}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.cardFooterLeft}>
          <View style={styles.statItem}>
            <FontAwesome6 name="star" size={12} color="#f59e0b" solid />
            <Text style={styles.statText}>{project.stars}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome6 name="code-branch" size={12} color="#6b7280" />
            <Text style={styles.statText}>{project.forks}</Text>
          </View>
          <View style={[styles.languageTag, { backgroundColor: project.languageBg }]}>
            <Text style={[styles.languageText, { color: project.languageColor }]}>
              {project.language}
            </Text>
          </View>
        </View>
        <View style={styles.cardFooterRight}>
          <FontAwesome6 name="clock" size={12} color="#6b7280" />
          <Text style={styles.collectedAtText}>{project.collectedAt}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProjectCard;

