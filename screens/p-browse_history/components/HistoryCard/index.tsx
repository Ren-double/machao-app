

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
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

interface HistoryCardProps {
  item: HistoryItem;
  onPress: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardRepo}>{item.owner} / {item.repo}</Text>
        </View>
        <Text style={styles.cardTime}>{item.timeAgo}</Text>
      </View>
      
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <FontAwesome6 name="star" size={12} color="#f59e0b" solid />
            <Text style={styles.statText}>{item.stars}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome6 name="code-branch" size={12} color="#6b7280" />
            <Text style={styles.statText}>{item.forks}</Text>
          </View>
          <View style={[styles.languageTag, { backgroundColor: item.languageBg }]}>
            <Text style={[styles.languageText, { color: item.languageColor }]}>
              {item.language}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HistoryCard;

