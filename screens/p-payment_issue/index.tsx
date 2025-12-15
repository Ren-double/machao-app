

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
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
      title: '如何订阅高级会员？',
      description: '订阅高级会员的步骤：',
      steps: [
        '进入"个人中心"页面',
        '点击"会员订阅"选项',
        '选择适合您的订阅计划',
        '选择支付方式并完成支付',
        '支付成功后，您将立即享受高级会员权益'
      ]
    },
    {
      id: '2',
      icon: 'circle-exclamation',
      iconColor: '#ef4444',
      iconBgColor: '#fef2f2',
      title: '支付失败怎么办？',
      description: '如果您遇到支付失败的情况，可以尝试以下解决方法：',
      steps: [
        '检查您的网络连接是否正常',
        '确认您的支付账户余额充足',
        '尝试使用其他支付方式',
        '等待几分钟后重新尝试支付',
        '如果问题仍然存在，请联系客服'
      ]
    },
    {
      id: '3',
      icon: 'arrow-rotate-right',
      iconColor: '#10b981',
      iconBgColor: '#f0fdf4',
      title: '如何取消自动续费？',
      description: '取消自动续费的方法：',
      steps: [
        '进入"个人中心"页面',
        '点击"会员订阅"选项',
        '找到"自动续费"设置',
        '关闭自动续费开关',
        '确认取消操作'
      ]
    },
    {
      id: '4',
      icon: 'receipt',
      iconColor: '#3b82f6',
      iconBgColor: '#dbeafe',
      title: '如何获取发票？',
      description: '获取发票的步骤：',
      steps: [
        '进入"个人中心"页面',
        '点击"我的订单"选项',
        '找到需要开票的订单',
        '点击"申请发票"按钮',
        '填写发票信息并提交',
        '发票将在1-3个工作日内开具完成'
      ]
    }
  ];

  const paymentRecords = [
    {
      id: '1',
      title: '高级会员月订阅',
      date: '2023-06-15 14:30',
      amount: '¥19.90'
    },
    {
      id: '2',
      title: '代码存储空间扩展',
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
        <Text style={styles.headerTitle}>支付问题</Text>
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
            <Text style={styles.sectionTitle}>最近支付记录</Text>
            <TouchableOpacity onPress={handleViewAllPayments} activeOpacity={0.7}>
              <Text style={styles.viewAllButton}>查看全部</Text>
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
            <Text style={styles.contactDescription}>支付问题需要帮助？</Text>
            <TouchableOpacity 
              style={styles.contactButton} 
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <Text style={styles.contactButtonText}>联系客服</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentIssueScreen;

