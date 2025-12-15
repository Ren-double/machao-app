

import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface PaymentItemProps {
  icon: string;
  iconColor: string;
  iconBgColor: string;
  title: string;
  description: string;
  steps: string[];
  isLast?: boolean;
}

const PaymentItem: React.FC<PaymentItemProps> = ({
  icon,
  iconColor,
  iconBgColor,
  title,
  description,
  steps,
  isLast = false,
}) => {
  return (
    <View style={[styles.container, isLast && styles.lastItem]}>
      <View style={styles.titleContainer}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <FontAwesome6 name={icon} size={16} color={iconColor} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PaymentItem;

