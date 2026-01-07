

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import i18n from '../../services/i18n';
import styles from './styles';

const HelpFeedbackScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleAccountIssuePress = () => {
    router.push('/p-account_issue');
  };

  const handleFunctionUsagePress = () => {
    router.push('/p-function_usage');
  };

  const handlePaymentIssuePress = () => {
    router.push('/p-payment_issue');
  };

  const handleFeedbackPress = () => {
    router.push('/p-feedback_form');
  };

  const handleEmailUsPress = () => {
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
        <Text style={styles.headerTitle}>{i18n.t('p_help_feedback')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 常见问题 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.t('common_questions')}</Text>
          </View>
          <View style={styles.menuList}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleAccountIssuePress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.blueIconContainer]}>
                  <FontAwesome6 name="user" size={16} color="#3b82f6" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{i18n.t('p_account_issue')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('account_issues_desc')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleFunctionUsagePress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.greenIconContainer]}>
                  <FontAwesome6 name="gear" size={16} color="#10b981" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{i18n.t('p_function_usage')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('function_usage_desc')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handlePaymentIssuePress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.purpleIconContainer]}>
                  <FontAwesome6 name="credit-card" size={16} color="#8b5cf6" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{i18n.t('p_payment_issue')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('payment_issues_desc')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 联系我们 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.t('contact_us')}</Text>
          </View>
          <View style={styles.menuList}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleFeedbackPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.orangeIconContainer]}>
                  <FontAwesome6 name="comment-dots" size={16} color="#f59e0b" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{i18n.t('p_feedback_form')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('feedback_desc')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleEmailUsPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, styles.redIconContainer]}>
                  <FontAwesome6 name="envelope" size={16} color="#ef4444" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{i18n.t('email_contact')}</Text>
                  <Text style={styles.menuItemSubtitle}>{i18n.t('email_address')}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 版本信息 */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>{i18n.t('current_version', { version: '1.0.0' })}</Text>
          <Text style={styles.versionSubtext}>{i18n.t('contact_hint')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpFeedbackScreen;

