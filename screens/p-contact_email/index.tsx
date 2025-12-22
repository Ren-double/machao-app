

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
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
      Alert.alert('成功', '邮箱地址已复制到剪贴板');
    } catch (error) {
      Alert.alert('错误', '复制失败，请手动复制');
    }
  };

  const handleOpenEmailApp = async () => {
    const emailUrl = 'mailto:1430237147@qq.com';
    try {
      const supported = await Linking.canOpenURL(emailUrl);
      if (supported) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('提示', '无法打开邮件应用');
      }
    } catch (error) {
      Alert.alert('错误', '打开邮件应用失败');
    }
  };

  const emailContacts = [
    {
      id: 'support',
      title: '客服邮箱',
      email: '1430237147@qq.com',
      icon: 'headset',
      iconColor: '#ef4444',
      backgroundColor: '#fef2f2',
    },
    {
      id: 'tech',
      title: '技术支持',
      email: '1430237147@qq.com',
      icon: 'bug',
      iconColor: '#3b82f6',
      backgroundColor: '#eff6ff',
    },
    {
      id: 'business',
      title: '商务合作',
      email: '1430237147@qq.com',
      icon: 'handshake',
      iconColor: '#10b981',
      backgroundColor: '#f0fdf4',
    },
  ];

  const contactTips = [
    '• 工作时间：周一至周五 9:00-18:00',
    '• 请在邮件中详细描述您的问题，以便我们更好地帮助您',
    '• 如需技术支持，请提供相关截图和错误信息',
    '• 紧急问题建议直接拨打客服电话：400-123-4567',
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
        <Text style={styles.headerTitle}>邮件联系</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 联系邮箱信息 */}
        <View style={styles.emailInfoSection}>
          <View style={styles.emailInfoContent}>
            <View style={styles.emailIconContainer}>
              <FontAwesome6 name="envelope" size={32} color="#ef4444" />
            </View>
            <Text style={styles.emailInfoTitle}>发送邮件给我们</Text>
            <Text style={styles.emailInfoDescription}>
              我们的客服团队会在24小时内回复您的邮件
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
                  <Text style={styles.copyButton}>复制</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* 快速发送邮件 */}
        <View style={styles.quickEmailSection}>
          <View style={styles.quickEmailContent}>
            <Text style={styles.quickEmailTitle}>快速发送邮件</Text>
            <TouchableOpacity 
              style={styles.openEmailButton} 
              onPress={handleOpenEmailApp}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="paper-plane" size={16} color="#ffffff" style={styles.openEmailIcon} />
              <Text style={styles.openEmailButtonText}>打开邮件应用</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 联系提示 */}
        <View style={styles.contactTipsSection}>
          <View style={styles.contactTipsContent}>
            <Text style={styles.contactTipsTitle}>联系提示</Text>
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

