import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import i18n from '../../services/i18n';
import styles from './styles';

const PrivacyPolicyScreen = () => {
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
        <Text style={styles.headerTitle}>{i18n.t('privacy_title')}</Text>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 隐私政策内容卡片 */}
        <View style={styles.contentCard}>
          <View style={styles.cardContent}>
            {/* 标题部分 */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>{i18n.t('privacy_title')}</Text>
              <Text style={styles.updateDate}>{i18n.t('privacy_update_date')}</Text>
            </View>
            
            {/* 隐私政策内容 */}
            <View style={styles.privacyContent}>
              {/* 第1节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>{i18n.t('privacy_section_1_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('privacy_section_1_text')}
                </Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_1_item_1')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_1_item_2')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_1_item_3')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_1_item_4')}</Text>
                </View>
              </View>
              
              {/* 第2节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>{i18n.t('privacy_section_2_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('privacy_section_2_text')}
                </Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_2_item_1')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_2_item_2')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_2_item_3')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_2_item_4')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_2_item_5')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_2_item_6')}</Text>
                </View>
              </View>
              
              {/* 第3节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>{i18n.t('privacy_section_3_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('privacy_section_3_text')}
                </Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_3_item_1')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_3_item_2')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_3_item_3')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_3_item_4')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_3_item_5')}</Text>
                </View>
              </View>
              
              {/* 第4节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>{i18n.t('privacy_section_4_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('privacy_section_4_text')}
                </Text>
              </View>
              
              {/* 第5节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>{i18n.t('privacy_section_5_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('privacy_section_5_text')}
                </Text>
              </View>
              
              {/* 第6节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>{i18n.t('privacy_section_6_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('privacy_section_6_text')}
                </Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_6_item_1')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_6_item_2')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_6_item_3')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_6_item_4')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_6_item_5')}</Text>
                  <Text style={styles.listItem}>{i18n.t('privacy_section_6_item_6')}</Text>
                </View>
              </View>
              
              {/* 第7节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>{i18n.t('privacy_section_7_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('privacy_section_7_text')}
                </Text>
              </View>
              
              {/* 第8节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>{i18n.t('privacy_section_8_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('privacy_section_8_text')}
                </Text>
              </View>
              
              {/* 第9节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>{i18n.t('privacy_section_9_title')}</Text>
                <Text style={styles.sectionText}>
                  {i18n.t('privacy_section_9_text')}
                </Text>
                <Text style={styles.contactText}>
                  {i18n.t('privacy_contact_info')}
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
            <Text style={styles.confirmButtonText}>{i18n.t('privacy_agree_button')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;
