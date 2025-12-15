

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

const AccountSecurityScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleChangePasswordPress = () => {
    router.push('/p-change_password');
  };

  const handleBindPhonePress = () => {
    router.push('/p-bind_phone');
  };

  const handleBindEmailPress = () => {
    router.push('/p-bind_email');
  };

  const handleManageDevicesPress = () => {
    router.push('/p-manage_devices');
  };

  const handleDeleteAccountPress = () => {
    Alert.alert(
      '注销账户',
      '确定要注销账户吗？此操作不可撤销。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            console.log('执行账户注销操作');
            // 此功能在PRD中未明确定义具体实现，暂时只做日志输出
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>账户安全</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 账户安全选项 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>账户安全</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleChangePasswordPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, styles.blueIconContainer]}>
                <FontAwesome6 name="lock" size={16} color="#3b82f6" />
              </View>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemTitle}>修改密码</Text>
                <Text style={styles.menuItemSubtitle}>定期更换密码以保障安全</Text>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleBindPhonePress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, styles.greenIconContainer]}>
                <FontAwesome6 name="mobile-screen" size={16} color="#10b981" />
              </View>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemTitle}>绑定手机</Text>
                <Text style={styles.menuItemSubtitle}>未绑定</Text>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleBindEmailPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, styles.purpleIconContainer]}>
                <FontAwesome6 name="envelope" size={16} color="#8b5cf6" />
              </View>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemTitle}>绑定邮箱</Text>
                <Text style={styles.menuItemSubtitle}>未绑定</Text>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* 登录设备管理 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>登录设备管理</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleManageDevicesPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, styles.orangeIconContainer]}>
                <FontAwesome6 name="mobile-screen" size={16} color="#f59e0b" />
              </View>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemTitle}>当前设备</Text>
                <Text style={styles.menuItemSubtitle}>iPhone 13 Pro</Text>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* 注销账户 */}
        <View style={styles.deleteAccountSection}>
          <TouchableOpacity 
            style={styles.deleteAccountButton} 
            onPress={handleDeleteAccountPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="user-slash" size={16} color="#ef4444" style={styles.deleteAccountIcon} />
            <Text style={styles.deleteAccountText}>注销账户</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSecurityScreen;

