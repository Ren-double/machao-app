

import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface SettingItemProps {
  icon?: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
  isLast?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  iconColor,
  iconBackgroundColor,
  title,
  description,
  isEnabled,
  onToggle,
  disabled = false,
  isLast = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isLast && styles.lastItem]}
      onPress={() => !disabled && onToggle(!isEnabled)}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View style={styles.content}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
            <FontAwesome6 name={icon} size={16} color={iconColor} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, disabled && styles.disabledText]}>{title}</Text>
          <Text style={[styles.description, disabled && styles.disabledDescription]}>
            {description}
          </Text>
        </View>
      </View>
      <Switch
        value={isEnabled}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
        thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
        ios_backgroundColor="#e5e7eb"
      />
    </TouchableOpacity>
  );
};

export default SettingItem;

