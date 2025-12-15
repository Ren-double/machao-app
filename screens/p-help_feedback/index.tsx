

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
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
        <Text style={styles.headerTitle}>帮助与反馈</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 常见问题 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>常见问题</Text>
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
                  <Text style={styles.menuItemTitle}>账户问题</Text>
                  <Text style={styles.menuItemSubtitle}>登录、注册、找回密码等</Text>
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
                  <Text style={styles.menuItemTitle}>功能使用</Text>
                  <Text style={styles.menuItemSubtitle}>如何使用各项功能</Text>
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
                  <Text style={styles.menuItemTitle}>支付问题</Text>
                  <Text style={styles.menuItemSubtitle}>充值、订阅等</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 联系我们 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>联系我们</Text>
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
                  <Text style={styles.menuItemTitle}>意见反馈</Text>
                  <Text style={styles.menuItemSubtitle}>提交问题或建议</Text>
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
                  <Text style={styles.menuItemTitle}>邮件联系</Text>
                  <Text style={styles.menuItemSubtitle}>support@machao.com</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 版本信息 */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>当前版本: 1.0.0</Text>
          <Text style={styles.versionSubtext}>如有任何问题，请随时联系我们</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpFeedbackScreen;

