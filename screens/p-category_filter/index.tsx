import i18n from '../../services/i18n';



import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import { LANGUAGES_DATA, PROJECT_TYPES_DATA } from '../../config/constants';

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
  const params = useLocalSearchParams();
  
  // 状态管理
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);

  // 初始化状态（从参数中获取）
  useEffect(() => {
    if (params.selected_languages && typeof params.selected_languages === 'string') {
        const languages = params.selected_languages.split(',').filter(l => l.trim() !== '');
        setSelectedLanguages(languages);
    }
    
    if (params.selected_project_types && typeof params.selected_project_types === 'string') {
        const types = params.selected_project_types.split(',').filter(t => t.trim() !== '');
        setSelectedProjectTypes(types);
    }
  }, [params.selected_languages, params.selected_project_types]);

  const [languageSearchTerm, setLanguageSearchTerm] = useState('');
  const [projectTypeSearchTerm, setProjectTypeSearchTerm] = useState('');

  // 编程语言数据
  const languagesData: LanguageOption[] = LANGUAGES_DATA;

  // 项目类型数据
  const projectTypesData: FilterOption[] = PROJECT_TYPES_DATA;

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
    // 使用 router.navigate 并传递参数，以确保首页能够接收到更新后的筛选条件并自动刷新
    // router.back() 无法传递参数更新上一页状态
    router.navigate({
      pathname: '/p-home',
      params: {
        selected_languages: selectedLanguages.join(','),
        selected_project_types: selectedProjectTypes.join(',')
      }
    });
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
    
    let displayText = value;
    if (type === 'project_type') {
      const found = PROJECT_TYPES_DATA.find(pt => pt.value === value);
      if (found) {
        displayText = i18n.t(found.label);
      }
    }

    return (
      <View key={`${type}-${value}`} style={styles.selectedFilterTag}>
        <FontAwesome6 name={iconName} size={12} color="#ffffff" style={styles.selectedFilterIcon} />
        <Text style={styles.selectedFilterText}>{displayText}</Text>
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
          {i18n.t(projectType.label)}
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
        <Text style={styles.headerTitle}>{i18n.t('category_filter_title')}</Text>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPress}
          activeOpacity={0.7}
        >
          <Text style={styles.confirmButtonText}>{i18n.t('confirm')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 已选条件展示区 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.t('selected_filters')}</Text>
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={handleClearAllPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="xmark" size={10} color="#6b7280" style={styles.clearAllIcon} />
              <Text style={styles.clearAllText}>{i18n.t('clear')}</Text>
            </TouchableOpacity>
          </View>
          
          {selectedLanguages.length === 0 && selectedProjectTypes.length === 0 ? (
            <View style={styles.noSelectedFilters}>
              <FontAwesome6 name="filter" size={24} color="#6b7280" style={styles.noFiltersIcon} />
              <Text style={styles.noFiltersText}>{i18n.t('no_selected_filters')}</Text>
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
            <Text style={styles.sectionTitle}>{i18n.t('programming_languages')}</Text>
            <Text style={styles.sectionCount}>{i18n.t('selected_count', { count: selectedLanguages.length })}</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <FontAwesome6 name="magnifying-glass" size={14} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={i18n.t('search_languages_placeholder')}
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
            <Text style={styles.sectionTitle}>{i18n.t('project_types')}</Text>
            <Text style={styles.sectionCount}>{i18n.t('selected_count', { count: selectedProjectTypes.length })}</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <FontAwesome6 name="magnifying-glass" size={14} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={i18n.t('search_project_types_placeholder')}
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

