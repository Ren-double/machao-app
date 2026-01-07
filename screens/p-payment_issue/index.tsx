

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import i18n from '../../services/i18n';
import PaymentItem from './components/PaymentItem';
import PaymentRecord from './components/PaymentRecord';
import styles from './styles';

const PaymentIssueScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleViewAllPayments = () => {
    console.log('查看全部支付记录');
    // 此功能在PRD中未明确定义具体页面，暂时只做日志输出
  };

  const handleContactSupport = () => {
    router.push('/p-contact_email');
  };

  const paymentItems = [
    {
      id: '1',
      icon: 'credit-card',
      iconColor: '#8b5cf6',
      iconBgColor: '#f3e8ff',
      title: i18n.t('payment_faq_1_title'),
      description: i18n.t('payment_faq_1_desc'),
      steps: [
        i18n.t('payment_faq_1_step_1'),
        i18n.t('payment_faq_1_step_2'),
        i18n.t('payment_faq_1_step_3'),
        i18n.t('payment_faq_1_step_4'),
        i18n.t('payment_faq_1_step_5')
      ]
    },
    {
      id: '2',
      icon: 'circle-exclamation',
      iconColor: '#ef4444',
      iconBgColor: '#fef2f2',
      title: i18n.t('payment_faq_2_title'),
      description: i18n.t('payment_faq_2_desc'),
      steps: [
        i18n.t('payment_faq_2_step_1'),
        i18n.t('payment_faq_2_step_2'),
        i18n.t('payment_faq_2_step_3'),
        i18n.t('payment_faq_2_step_4'),
        i18n.t('payment_faq_2_step_5')
      ]
    },
    {
      id: '3',
      icon: 'arrow-rotate-right',
      iconColor: '#10b981',
      iconBgColor: '#f0fdf4',
      title: i18n.t('payment_faq_3_title'),
      description: i18n.t('payment_faq_3_desc'),
      steps: [
        i18n.t('payment_faq_3_step_1'),
        i18n.t('payment_faq_3_step_2'),
        i18n.t('payment_faq_3_step_3'),
        i18n.t('payment_faq_3_step_4'),
        i18n.t('payment_faq_3_step_5')
      ]
    },
    {
      id: '4',
      icon: 'receipt',
      iconColor: '#3b82f6',
      iconBgColor: '#dbeafe',
      title: i18n.t('payment_faq_4_title'),
      description: i18n.t('payment_faq_4_desc'),
      steps: [
        i18n.t('payment_faq_4_step_1'),
        i18n.t('payment_faq_4_step_2'),
        i18n.t('payment_faq_4_step_3'),
        i18n.t('payment_faq_4_step_4'),
        i18n.t('payment_faq_4_step_5'),
        i18n.t('payment_faq_4_step_6')
      ]
    }
  ];

  const paymentRecords = [
    {
      id: '1',
      title: i18n.t('mock_payment_1_title'),
      date: '2023-06-15 14:30',
      amount: '¥19.90'
    },
    {
      id: '2',
      title: i18n.t('mock_payment_2_title'),
      date: '2023-05-20 09:15',
      amount: '¥39.90'
    }
  ];

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
        <Text style={styles.headerTitle}>{i18n.t('payment_issue_title')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 支付问题解答 */}
        <View style={styles.section}>
          {paymentItems.map((item, index) => (
            <PaymentItem
              key={item.id}
              icon={item.icon}
              iconColor={item.iconColor}
              iconBgColor={item.iconBgColor}
              title={item.title}
              description={item.description}
              steps={item.steps}
              isLast={index === paymentItems.length - 1}
            />
          ))}
        </View>

        {/* 支付记录 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.t('recent_payment_records')}</Text>
            <TouchableOpacity onPress={handleViewAllPayments} activeOpacity={0.7}>
              <Text style={styles.viewAllButton}>{i18n.t('view_all')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recordsContainer}>
            {paymentRecords.map((record) => (
              <PaymentRecord
                key={record.id}
                title={record.title}
                date={record.date}
                amount={record.amount}
              />
            ))}
          </View>
        </View>

        {/* 联系支持 */}
        <View style={styles.section}>
          <View style={styles.contactContainer}>
            <Text style={styles.contactDescription}>{i18n.t('payment_help_desc')}</Text>
            <TouchableOpacity 
              style={styles.contactButton} 
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <Text style={styles.contactButtonText}>{i18n.t('contact_support')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentIssueScreen;

