

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import i18n from '../../services/i18n';
import styles from './styles';

const ContactEmailScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await Clipboard.setStringAsync(email);
      Alert.alert(i18n.t('copy_success'), i18n.t('email_copied'));
    } catch (error) {
      Alert.alert(i18n.t('alert_error'), i18n.t('copy_failed'));
    }
  };

  const handleOpenEmailApp = async () => {
    const emailUrl = 'mailto:1430237147@qq.com';
    try {
      const supported = await Linking.canOpenURL(emailUrl);
      if (supported) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert(i18n.t('alert_tip'), i18n.t('cannot_open_email'));
      }
    } catch (error) {
      Alert.alert(i18n.t('alert_error'), i18n.t('open_email_failed'));
    }
  };

  const emailContacts = [
    {
      id: 'support',
      title: i18n.t('support_email_title'),
      email: '1430237147@qq.com',
      icon: 'headset',
      iconColor: '#ef4444',
      backgroundColor: '#fef2f2',
    },
    {
      id: 'tech',
      title: i18n.t('tech_support_email_title'),
      email: '1430237147@qq.com',
      icon: 'bug',
      iconColor: '#3b82f6',
      backgroundColor: '#eff6ff',
    },
    {
      id: 'business',
      title: i18n.t('business_email_title'),
      email: '1430237147@qq.com',
      icon: 'handshake',
      iconColor: '#10b981',
      backgroundColor: '#f0fdf4',
    },
  ];

  const contactTips = [
    i18n.t('contact_tip_1'),
    i18n.t('contact_tip_2'),
    i18n.t('contact_tip_3'),
    i18n.t('contact_tip_4'),
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
        <Text style={styles.headerTitle}>{i18n.t('contact_email_title')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 联系邮箱信息 */}
        <View style={styles.emailInfoSection}>
          <View style={styles.emailInfoContent}>
            <View style={styles.emailIconContainer}>
              <FontAwesome6 name="envelope" size={32} color="#ef4444" />
            </View>
            <Text style={styles.emailInfoTitle}>{i18n.t('send_email_to_us')}</Text>
            <Text style={styles.emailInfoDescription}>
              {i18n.t('email_response_time')}
            </Text>
            
            {/* 邮箱卡片列表 */}
            {emailContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.emailCard}
                onPress={() => handleCopyEmail(contact.email)}
                activeOpacity={0.7}
              >
                <View style={styles.emailCardContent}>
                  <View style={styles.emailCardLeft}>
                    <View style={[styles.emailCardIcon, { backgroundColor: contact.backgroundColor }]}>
                      <FontAwesome6 name={contact.icon} size={16} color={contact.iconColor} />
                    </View>
                    <View style={styles.emailCardInfo}>
                      <Text style={styles.emailCardTitle}>{contact.title}</Text>
                      <Text style={styles.emailCardEmail}>{contact.email}</Text>
                    </View>
                  </View>
                  <Text style={styles.copyButton}>{i18n.t('copy')}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* 快速发送邮件 */}
        <View style={styles.quickEmailSection}>
          <View style={styles.quickEmailContent}>
            <Text style={styles.quickEmailTitle}>{i18n.t('quick_email_title')}</Text>
            <TouchableOpacity 
              style={styles.openEmailButton} 
              onPress={handleOpenEmailApp}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="paper-plane" size={16} color="#ffffff" style={styles.openEmailIcon} />
              <Text style={styles.openEmailButtonText}>{i18n.t('open_email_app')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 联系提示 */}
        <View style={styles.contactTipsSection}>
          <View style={styles.contactTipsContent}>
            <Text style={styles.contactTipsTitle}>{i18n.t('contact_tips_title')}</Text>
            <View style={styles.contactTipsList}>
              {contactTips.map((tip, index) => (
                <Text key={index} style={styles.contactTipItem}>
                  {tip}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactEmailScreen;

