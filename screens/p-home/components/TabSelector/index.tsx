

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import i18n from '../../../../services/i18n';

type TabType = 'daily' | 'trending';

interface TabSelectorProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            currentTab === 'daily' ? styles.tabActive : styles.tabInactive
          ]}
          onPress={() => onTabChange('daily')}
        >
          <FontAwesome6
            name="fire"
            size={14}
            color={currentTab === 'daily' ? '#ffffff' : '#6b7280'}
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              currentTab === 'daily' ? styles.tabTextActive : styles.tabTextInactive
            ]}
          >
            {i18n.t('tab_daily')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            currentTab === 'trending' ? styles.tabActive : styles.tabInactive
          ]}
          onPress={() => onTabChange('trending')}
        >
          <FontAwesome6
            name="chart-line"
            size={14}
            color={currentTab === 'trending' ? '#ffffff' : '#6b7280'}
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              currentTab === 'trending' ? styles.tabTextActive : styles.tabTextInactive
            ]}
          >
            {i18n.t('tab_trending')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabSelector;

