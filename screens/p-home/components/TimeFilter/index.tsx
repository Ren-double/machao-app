

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

type TimeFilterType = 'day' | 'week' | 'month';

interface TimeFilterProps {
  currentTimeFilter: TimeFilterType;
  onTimeFilterChange: (timeFilter: TimeFilterType) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({
  currentTimeFilter,
  onTimeFilterChange,
}) => {
  const timeFilterOptions = [
    { key: 'day' as TimeFilterType, label: '今日' },
    { key: 'week' as TimeFilterType, label: '本周' },
    { key: 'month' as TimeFilterType, label: '本月' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {timeFilterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterButton,
              currentTimeFilter === option.key
                ? styles.filterButtonActive
                : styles.filterButtonInactive
            ]}
            onPress={() => onTimeFilterChange(option.key)}
          >
            <Text
              style={[
                styles.filterText,
                currentTimeFilter === option.key
                  ? styles.filterTextActive
                  : styles.filterTextInactive
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TimeFilter;

