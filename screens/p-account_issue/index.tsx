

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import FaqItem from './components/FaqItem';
import styles from './styles';
import i18n from '../../services/i18n';

interface FaqData {
  id: string;
  question: string;
  answer: string;
}

const AccountIssueScreen = () => {
  const router = useRouter();

  const faqData: FaqData[] = [
    {
      id: '1',
      question: i18n.t('account_faq_1_q'),
      answer: i18n.t('account_faq_1_a')
    },
    {
      id: '2',
      question: i18n.t('account_faq_2_q'),
      answer: i18n.t('account_faq_2_a')
    },
    {
      id: '3',
      question: i18n.t('account_faq_3_q'),
      answer: i18n.t('account_faq_3_a')
    },
    {
      id: '4',
      question: i18n.t('account_faq_4_q'),
      answer: i18n.t('account_faq_4_a')
    },
    {
      id: '5',
      question: i18n.t('account_faq_5_q'),
      answer: i18n.t('account_faq_5_a')
    }
  ];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleContactSupportPress = () => {
    router.push('/p-contact_email');
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
        <Text style={styles.headerTitle}>{i18n.t('account_issue_title')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 常见问题列表 */}
        <View style={styles.faqSection}>
          {faqData.map((item, index) => (
            <FaqItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isLast={index === faqData.length - 1}
            />
          ))}
        </View>

        {/* 联系支持 */}
        <View style={styles.contactSection}>
          <Text style={styles.contactDescription}>{i18n.t('still_have_questions')}</Text>
          <TouchableOpacity 
            style={styles.contactButton} 
            onPress={handleContactSupportPress}
            activeOpacity={0.8}
          >
            <Text style={styles.contactButtonText}>{i18n.t('contact_support')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountIssueScreen;

