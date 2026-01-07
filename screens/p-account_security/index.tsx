
import i18n from '../../services/i18n';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Device from 'expo-device';
import styles from './styles';

const AccountSecurityScreen = () => {
  const router = useRouter();
  const [deviceName, setDeviceName] = React.useState('Unknown Device');

  React.useEffect(() => {
    if (Device.modelName) {
      setDeviceName(Device.modelName);
    } else {
      setDeviceName(`${Device.osName || 'Unknown'} Device`);
    }
  }, []);

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
      i18n.t('unregister_account'),
      i18n.t('unregister_account_confirm'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('confirm'),
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
        <Text style={styles.headerTitle}>{i18n.t('account_security')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 账户安全选项 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.t('account_security')}</Text>
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
                <Text style={styles.menuItemTitle}>{i18n.t('change_password')}</Text>
                <Text style={styles.menuItemSubtitle}>{i18n.t('change_password_desc')}</Text>
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
                <Text style={styles.menuItemTitle}>{i18n.t('bind_phone')}</Text>
                <Text style={styles.menuItemSubtitle}>{i18n.t('not_bound')}</Text>
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
                <Text style={styles.menuItemTitle}>{i18n.t('bind_email')}</Text>
                <Text style={styles.menuItemSubtitle}>{i18n.t('not_bound')}</Text>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* 登录设备管理 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.t('login_device_management')}</Text>
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
                <Text style={styles.menuItemTitle}>{i18n.t('current_device')}</Text>
                <Text style={styles.menuItemSubtitle}>{deviceName}</Text>
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
            <Text style={styles.deleteAccountText}>{i18n.t('unregister_account')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSecurityScreen;

