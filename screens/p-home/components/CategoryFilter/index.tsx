

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface CategoryFilterProps {
  selectedLanguages: string[];
  onPress: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedLanguages,
  onPress,
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.filterButton} onPress={onPress}>
        <View style={styles.leftContent}>
          <FontAwesome6 name="filter" size={16} color="#6b7280" />
          <Text style={styles.filterText}>分类筛选</Text>
          {selectedLanguages.length > 0 && (
            <View style={styles.activeFiltersContainer}>
              {selectedLanguages.map((language, index) => (
                <View
                  key={index}
                  style={[styles.languageTag, getLanguageTagStyle(language)]}
                >
                  <Text style={styles.languageText}>{language}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
};

export default CategoryFilter;

