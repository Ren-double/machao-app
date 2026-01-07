import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import i18n from '../../services/i18n';
import styles from './styles';

const TermsOfServiceScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleConfirmPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="chevron-left" size={16} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('terms_title')}</Text>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* 使用条款内容卡片 */}
        <View style={styles.termsCard}>
          <View style={styles.cardContent}>
            {/* 标题部分 */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>{i18n.t('terms_title')}</Text>
              <Text style={styles.updateDate}>{i18n.t('terms_update_date')}</Text>
            </View>
            
            {/* 条款内容 */}
            <View style={styles.termsContent}>
              {/* 第1条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>{i18n.t('terms_section_1_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('terms_section_1_text')}
                </Text>
              </View>
              
              {/* 第2条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>{i18n.t('terms_section_2_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('terms_section_2_text')}
                </Text>
              </View>
              
              {/* 第3条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>{i18n.t('terms_section_3_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('terms_section_3_text')}
                </Text>
                <View style={styles.bulletList}>
                  <Text style={styles.bulletItem}>{i18n.t('terms_section_3_item_1')}</Text>
                  <Text style={styles.bulletItem}>{i18n.t('terms_section_3_item_2')}</Text>
                  <Text style={styles.bulletItem}>{i18n.t('terms_section_3_item_3')}</Text>
                  <Text style={styles.bulletItem}>{i18n.t('terms_section_3_item_4')}</Text>
                </View>
              </View>
              
              {/* 第4条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>{i18n.t('terms_section_4_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('terms_section_4_text')}
                </Text>
              </View>
              
              {/* 第5条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>{i18n.t('terms_section_5_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('terms_section_5_text')}
                </Text>
              </View>
              
              {/* 第6条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>{i18n.t('terms_section_6_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('terms_section_6_text')}
                </Text>
              </View>
              
              {/* 第7条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>{i18n.t('terms_section_7_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('terms_section_7_text')}
                </Text>
              </View>
              
              {/* 第8条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>{i18n.t('terms_section_8_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('terms_section_8_text')}
                </Text>
              </View>
              
              {/* 第9条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>{i18n.t('terms_section_9_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('terms_section_9_text')}
                </Text>
              </View>
              
              {/* 第10条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>{i18n.t('terms_section_10_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('terms_section_10_text')}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* 确认按钮 */}
        <View style={styles.confirmSection}>
          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={handleConfirmPress}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>{i18n.t('terms_agree_button')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfServiceScreen;
