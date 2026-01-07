
import i18n from '../../services/i18n';
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const STORAGE_KEY = '@interest_settings';

interface SelectedInterests {
  language: string[];
  project_type: string[];
}

interface InterestItem {
  interest: string;
  type: 'language' | 'project_type';
}

const InterestSettingsScreen = () => {
  const router = useRouter();
  
  // 已选兴趣状态
  const [selectedInterests, setSelectedInterests] = useState<SelectedInterests>({
    language: ['JavaScript', 'Python'],
    project_type: ['Web框架']
  });

  // 搜索输入状态
  const [languageSearchQuery, setLanguageSearchQuery] = useState('');
  const [projectTypeSearchQuery, setProjectTypeSearchQuery] = useState('');

  // 成功提示状态
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // 加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        setSelectedInterests(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load interest settings:', error);
    }
  };

  // 编程语言数据
  const programmingLanguages = [
    'JavaScript', 'Python', 'Java', 'Go', 'TypeScript', 'C#', 'C++',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'Rust', 'Dart', 'R', 'MATLAB'
  ];

  // 项目类型数据
  const projectTypes = [
    'Web框架', '工具库', '应用程序', '数据库', '机器学习', '人工智能',
    '区块链', '游戏开发', '移动开发', 'DevOps', '网络安全', '数据分析',
    '物联网', '云计算', '微服务'
  ];

  // 返回按钮处理
  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  // 保存按钮处理
  const handleSavePress = useCallback(async () => {
    // 保存操作
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(selectedInterests));
      console.log('保存兴趣设置:', selectedInterests);
      
      // 显示成功提示
      setShowSuccessToast(true);
      
      // 2秒后隐藏提示并返回
      setTimeout(() => {
        setShowSuccessToast(false);
        setTimeout(() => {
          handleBackPress();
        }, 300);
      }, 2000);
    } catch (error) {
      console.error('Failed to save interest settings:', error);
      Alert.alert('错误', '保存失败，请重试');
    }
  }, [selectedInterests, handleBackPress]);

  // 添加兴趣
  const handleAddInterest = useCallback((type: 'language' | 'project_type', interest: string) => {
    setSelectedInterests(prev => ({
      ...prev,
      [type]: [...prev[type], interest]
    }));
  }, []);

  // 移除兴趣
  const handleRemoveInterest = useCallback((type: 'language' | 'project_type', interest: string) => {
    setSelectedInterests(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== interest)
    }));
  }, []);

  // 兴趣标签点击处理
  const handleInterestTagPress = useCallback((type: 'language' | 'project_type', interest: string) => {
    const isSelected = selectedInterests[type].includes(interest);
    
    if (isSelected) {
      handleRemoveInterest(type, interest);
    } else {
      handleAddInterest(type, interest);
    }
  }, [selectedInterests, handleAddInterest, handleRemoveInterest]);

  // 已选兴趣删除处理
  const handleSelectedInterestRemove = useCallback((type: 'language' | 'project_type', interest: string) => {
    handleRemoveInterest(type, interest);
  }, [handleRemoveInterest]);

  // 过滤兴趣列表
  const getFilteredLanguages = useCallback(() => {
    return programmingLanguages.filter(lang =>
      lang.toLowerCase().includes(languageSearchQuery.toLowerCase())
    );
  }, [languageSearchQuery]);

  const getFilteredProjectTypes = useCallback(() => {
    return projectTypes.filter(type =>
      type.toLowerCase().includes(projectTypeSearchQuery.toLowerCase())
    );
  }, [projectTypeSearchQuery]);

  // 获取所有已选兴趣
  const getAllSelectedInterests = useCallback((): InterestItem[] => {
    return [
      ...selectedInterests.language.map(interest => ({ interest, type: 'language' as const })),
      ...selectedInterests.project_type.map(interest => ({ interest, type: 'project_type' as const }))
    ];
  }, [selectedInterests]);

  // 渲染兴趣标签
  const renderInterestTag = useCallback((type: 'language' | 'project_type', interest: string) => {
    const isSelected = selectedInterests[type].includes(interest);
    
    return (
      <TouchableOpacity
        key={`${type}-${interest}`}
        style={[
          styles.interestTag,
          isSelected ? styles.interestTagSelected : styles.interestTagUnselected
        ]}
        onPress={() => handleInterestTagPress(type, interest)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.interestTagText,
          isSelected ? styles.interestTagTextSelected : styles.interestTagTextUnselected
        ]}>
          {interest}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedInterests, handleInterestTagPress]);

  // 渲染已选兴趣标签
  const renderSelectedInterestTag = useCallback((item: InterestItem) => {
    return (
      <View key={`selected-${item.type}-${item.interest}`} style={styles.selectedInterestTag}>
        <Text style={styles.selectedInterestTagText}>{item.interest}</Text>
        <TouchableOpacity
          style={styles.removeSelectedInterestButton}
          onPress={() => handleSelectedInterestRemove(item.type, item.interest)}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="xmark" size={10} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  }, [handleSelectedInterestRemove]);

  const allSelectedInterests = getAllSelectedInterests();
  const filteredLanguages = getFilteredLanguages();
  const filteredProjectTypes = getFilteredProjectTypes();

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
        
        <Text style={styles.headerTitle}>{i18n.t('interest_settings')}</Text>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSavePress}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>{i18n.t('save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 已选兴趣展示区 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('selected_interests')}</Text>
          
          {allSelectedInterests.length > 0 ? (
            <View style={styles.selectedInterestsContainer}>
              {allSelectedInterests.map(renderSelectedInterestTag)}
            </View>
          ) : (
            <Text style={styles.noSelectedText}>{i18n.t('no_selected_interests')}</Text>
          )}
        </View>

        {/* 编程语言选择 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.t('programming_languages')}</Text>
            <Text style={styles.sectionCount}>{i18n.t('selected_count', { count: selectedInterests.language.length })}</Text>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder={i18n.t('search_languages_placeholder')}
            value={languageSearchQuery}
            onChangeText={setLanguageSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          
          <View style={styles.interestTagsContainer}>
            {filteredLanguages.map(lang => renderInterestTag('language', lang))}
          </View>
        </View>

        {/* 项目类型选择 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.t('project_types')}</Text>
            <Text style={styles.sectionCount}>{i18n.t('selected_count', { count: selectedInterests.project_type.length })}</Text>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder={i18n.t('search_project_types_placeholder')}
            value={projectTypeSearchQuery}
            onChangeText={setProjectTypeSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          
          <View style={styles.interestTagsContainer}>
            {filteredProjectTypes.map(type => renderInterestTag('project_type', type))}
          </View>
        </View>
      </ScrollView>

      {/* 成功提示弹窗 */}
      {showSuccessToast && (
        <View style={styles.successToast}>
          <FontAwesome6 name="circle-check" size={16} color="#ffffff" />
          <Text style={styles.successToastText}>{i18n.t('save_success')}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default InterestSettingsScreen;

