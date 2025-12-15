

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface TopicItem {
  id: string;
  title: string;
  discussionCount: string;
  tag: string;
  color: string;
  backgroundColor: string;
}

interface TopicCardProps {
  topic: TopicItem;
  onPress: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: topic.backgroundColor }]}>
        <FontAwesome6 name="hashtag" size={14} color={topic.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{topic.title}</Text>
        <Text style={styles.discussionCount}>{topic.discussionCount}</Text>
      </View>
      <FontAwesome6 name="chevron-right" size={12} color="#6b7280" />
    </TouchableOpacity>
  );
};

export default TopicCard;

