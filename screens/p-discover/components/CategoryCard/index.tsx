

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface CategoryItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

interface CategoryCardProps {
  category: CategoryItem;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: category.backgroundColor }]}>
        <FontAwesome6 name={category.icon as any} size={20} color={category.color} />
      </View>
      <Text style={styles.title}>{category.title}</Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;

