

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import FaqItem from './components/FaqItem';
import styles from './styles';

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
      question: '如何注册新账户？',
      answer: '您可以通过以下步骤注册新账户：\n1. 打开码潮应用\n2. 点击"注册"按钮\n3. 输入您的邮箱地址和设置密码\n4. 点击"获取验证码"，并输入收到的验证码\n5. 点击"完成注册"即可'
    },
    {
      id: '2',
      question: '忘记密码怎么办？',
      answer: '如果您忘记了密码，可以通过以下步骤重置：\n1. 在登录页面点击"忘记密码"\n2. 输入您注册时使用的邮箱地址\n3. 点击"获取验证码"，并输入收到的验证码\n4. 设置新密码并确认\n5. 点击"重置密码"完成操作'
    },
    {
      id: '3',
      question: '如何修改个人资料？',
      answer: '修改个人资料的步骤如下：\n1. 登录您的账户\n2. 进入"个人中心"\n3. 点击"编辑资料"\n4. 修改您需要更新的信息，如头像、昵称等\n5. 点击"保存"完成修改'
    },
    {
      id: '4',
      question: '如何绑定/解绑第三方账号？',
      answer: '绑定/解绑第三方账号的方法：\n1. 登录您的账户\n2. 进入"个人中心"\n3. 点击"账号安全"\n4. 在第三方账号绑定区域，点击"绑定"或"解绑"按钮\n5. 按照提示完成操作'
    },
    {
      id: '5',
      question: '如何注销账户？',
      answer: '注销账户前请谨慎考虑，注销后账户数据将无法恢复。注销步骤：\n1. 登录您的账户\n2. 进入"个人中心"\n3. 点击"账号安全"\n4. 点击"注销账户"\n5. 按照提示完成注销流程'
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
        <Text style={styles.headerTitle}>账户问题</Text>
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
          <Text style={styles.contactDescription}>还有其他问题？</Text>
          <TouchableOpacity 
            style={styles.contactButton} 
            onPress={handleContactSupportPress}
            activeOpacity={0.8}
          >
            <Text style={styles.contactButtonText}>联系客服</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountIssueScreen;

