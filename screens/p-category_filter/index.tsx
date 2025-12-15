

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface FilterOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

interface LanguageOption extends FilterOption {
  tag: string;
  tagColor: string;
  tagBgColor: string;
}

const CategoryFilterScreen = () => {
  const router = useRouter();
  
  // 状态管理
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [languageSearchTerm, setLanguageSearchTerm] = useState('');
  const [projectTypeSearchTerm, setProjectTypeSearchTerm] = useState('');

  // 编程语言数据
  const languagesData: LanguageOption[] = [
    { value: 'JavaScript', label: 'JavaScript', tag: 'JS', tagColor: '#92400e', tagBgColor: '#fef3c7' },
    { value: 'Python', label: 'Python', tag: 'Py', tagColor: '#1e40af', tagBgColor: '#dbeafe' },
    { value: 'Java', label: 'Java', tag: 'Jv', tagColor: '#166534', tagBgColor: '#dcfce7' },
    { value: 'Go', label: 'Go', tag: 'Go', tagColor: '#991b1b', tagBgColor: '#fef2f2' },
    { value: 'TypeScript', label: 'TypeScript', tag: 'TS', tagColor: '#5b21b6', tagBgColor: '#e0e7ff' },
    { value: 'Rust', label: 'Rust', tag: 'Rs', tagColor: '#dc2626', tagBgColor: '#fef2f2' },
    { value: 'C++', label: 'C++', tag: 'C++', tagColor: '#7c3aed', tagBgColor: '#f3e8ff' },
    { value: 'Swift', label: 'Swift', tag: 'Sw', tagColor: '#0369a1', tagBgColor: '#dbeafe' },
    { value: 'Kotlin', label: 'Kotlin', tag: 'Kt', tagColor: '#d97706', tagBgColor: '#fef3c7' },
    { value: 'Dart', label: 'Dart', tag: 'Dt', tagColor: '#0284c7', tagBgColor: '#dbeafe' },
  ];

  // 项目类型数据
  const projectTypesData: FilterOption[] = [
    { value: 'Web框架', label: 'Web框架', icon: 'globe', color: '#2563eb' },
    { value: '工具库', label: '工具库', icon: 'screwdriver-wrench', color: '#10b981' },
    { value: '应用程序', label: '应用程序', icon: 'mobile-screen', color: '#f59e0b' },
    { value: '数据库', label: '数据库', icon: 'database', color: '#06b6d4' },
    { value: '机器学习', label: '机器学习', icon: 'brain', color: '#2563eb' },
    { value: '区块链', label: '区块链', icon: 'link', color: '#10b981' },
    { value: '游戏开发', label: '游戏开发', icon: 'gamepad', color: '#f59e0b' },
    { value: 'DevOps', label: 'DevOps', icon: 'gears', color: '#06b6d4' },
    { value: 'API服务', label: 'API服务', icon: 'server', color: '#2563eb' },
    { value: '文档工具', label: '文档工具', icon: 'file-lines', color: '#10b981' },
  ];

  // 过滤数据
  const filteredLanguages = languagesData.filter(language =>
    language.label.toLowerCase().includes(languageSearchTerm.toLowerCase())
  );

  const filteredProjectTypes = projectTypesData.filter(projectType =>
    projectType.label.toLowerCase().includes(projectTypeSearchTerm.toLowerCase())
  );

  // 事件处理函数
  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleConfirmPress = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedLanguages.length > 0) {
      params.append('selected_languages', selectedLanguages.join(','));
    }
    if (selectedProjectTypes.length > 0) {
      params.append('selected_project_types', selectedProjectTypes.join(','));
    }
    
    const queryString = params.toString();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push(`/p-home${queryString ? '?' + queryString : ''}`);
    }
  }, [router, selectedLanguages, selectedProjectTypes]);

  const handleClearAllPress = useCallback(() => {
    setSelectedLanguages([]);
    setSelectedProjectTypes([]);
  }, []);

  const handleLanguageToggle = useCallback((language: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(language)) {
        return prev.filter(l => l !== language);
      } else {
        return [...prev, language];
      }
    });
  }, []);

  const handleProjectTypeToggle = useCallback((projectType: string) => {
    setSelectedProjectTypes(prev => {
      if (prev.includes(projectType)) {
        return prev.filter(p => p !== projectType);
      } else {
        return [...prev, projectType];
      }
    });
  }, []);

  const handleRemoveFilter = useCallback((type: 'language' | 'project_type', value: string) => {
    if (type === 'language') {
      setSelectedLanguages(prev => prev.filter(l => l !== value));
    } else {
      setSelectedProjectTypes(prev => prev.filter(p => p !== value));
    }
  }, []);

  // 渲染已选条件标签
  const renderSelectedFilterTag = useCallback((type: 'language' | 'project_type', value: string) => {
    const iconName = type === 'language' ? 'code' : 'folder';
    
    return (
      <View key={`${type}-${value}`} style={styles.selectedFilterTag}>
        <FontAwesome6 name={iconName} size={12} color="#ffffff" style={styles.selectedFilterIcon} />
        <Text style={styles.selectedFilterText}>{value}</Text>
        <TouchableOpacity
          style={styles.removeFilterButton}
          onPress={() => handleRemoveFilter(type, value)}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="xmark" size={10} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  }, [handleRemoveFilter]);

  // 渲染编程语言选项
  const renderLanguageOption = useCallback((language: LanguageOption) => {
    const isSelected = selectedLanguages.includes(language.value);
    
    return (
      <TouchableOpacity
        key={language.value}
        style={[styles.filterOption, isSelected && styles.filterOptionSelected]}
        onPress={() => handleLanguageToggle(language.value)}
        activeOpacity={0.7}
      >
        <View style={[styles.languageTag, { backgroundColor: language.tagBgColor }]}>
          <Text style={[styles.languageTagText, { color: language.tagColor }]}>
            {language.tag}
          </Text>
        </View>
        <Text style={[styles.filterOptionText, isSelected && styles.filterOptionTextSelected]}>
          {language.label}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedLanguages, handleLanguageToggle]);

  // 渲染项目类型选项
  const renderProjectTypeOption = useCallback((projectType: FilterOption) => {
    const isSelected = selectedProjectTypes.includes(projectType.value);
    
    return (
      <TouchableOpacity
        key={projectType.value}
        style={[styles.filterOption, isSelected && styles.filterOptionSelected]}
        onPress={() => handleProjectTypeToggle(projectType.value)}
        activeOpacity={0.7}
      >
        <FontAwesome6 
          name={projectType.icon || 'folder'} 
          size={14} 
          color={projectType.color || '#6b7280'} 
          style={styles.projectTypeIcon}
        />
        <Text style={[styles.filterOptionText, isSelected && styles.filterOptionTextSelected]}>
          {projectType.label}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedProjectTypes, handleProjectTypeToggle]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="arrow-left" size={14} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>分类筛选</Text>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPress}
          activeOpacity={0.7}
        >
          <Text style={styles.confirmButtonText}>确定</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 已选条件展示区 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>已选条件</Text>
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={handleClearAllPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="xmark" size={10} color="#6b7280" style={styles.clearAllIcon} />
              <Text style={styles.clearAllText}>清空</Text>
            </TouchableOpacity>
          </View>
          
          {selectedLanguages.length === 0 && selectedProjectTypes.length === 0 ? (
            <View style={styles.noSelectedFilters}>
              <FontAwesome6 name="filter" size={24} color="#6b7280" style={styles.noFiltersIcon} />
              <Text style={styles.noFiltersText}>暂无筛选条件</Text>
            </View>
          ) : (
            <View style={styles.selectedFiltersContainer}>
              {selectedLanguages.map(language => 
                renderSelectedFilterTag('language', language)
              )}
              {selectedProjectTypes.map(projectType => 
                renderSelectedFilterTag('project_type', projectType)
              )}
            </View>
          )}
        </View>

        {/* 编程语言筛选 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>编程语言</Text>
            <Text style={styles.sectionCount}>已选 {selectedLanguages.length} 项</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <FontAwesome6 name="magnifying-glass" size={14} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索编程语言..."
              value={languageSearchTerm}
              onChangeText={setLanguageSearchTerm}
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          <View style={styles.filterGrid}>
            {filteredLanguages.map(renderLanguageOption)}
          </View>
        </View>

        {/* 项目类型筛选 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>项目类型</Text>
            <Text style={styles.sectionCount}>已选 {selectedProjectTypes.length} 项</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <FontAwesome6 name="magnifying-glass" size={14} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索项目类型..."
              value={projectTypeSearchTerm}
              onChangeText={setProjectTypeSearchTerm}
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          <View style={styles.filterGrid}>
            {filteredProjectTypes.map(renderProjectTypeOption)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryFilterScreen;

