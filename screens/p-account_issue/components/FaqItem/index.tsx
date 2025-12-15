

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface FaqItemProps {
  question: string;
  answer: string;
  isLast?: boolean;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isLast = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.faqItem, isLast && styles.faqItemLast]}>
      <TouchableOpacity 
        style={styles.faqQuestion} 
        onPress={handleToggleExpansion}
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>{question}</Text>
        <FontAwesome6 
          name="chevron-down" 
          size={14} 
          color="#6b7280" 
          style={[
            styles.faqIcon,
            isExpanded && styles.faqIconExpanded
          ]} 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

export default FaqItem;

