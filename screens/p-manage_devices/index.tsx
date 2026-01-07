

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Device from 'expo-device';
import styles from './styles';

interface DeviceItem {
  id: string;
  name: string;
  type: 'mobile' | 'laptop' | 'tablet' | 'desktop' | 'unknown';
  lastLogin: string;
  isCurrentDevice: boolean;
  osName: string;
}

const ManageDevicesScreen = () => {
  const router = useRouter();
  
  const [devices, setDevices] = useState<DeviceItem[]>([]);

  useEffect(() => {
    // 获取真实设备信息
    const currentDevice: DeviceItem = {
      id: 'current',
      name: Device.modelName || 'Unknown Device',
      type: getDeviceType(Device.deviceType),
      lastLogin: '刚刚',
      isCurrentDevice: true,
      osName: `${Device.osName} ${Device.osVersion}`,
    };
    setDevices([currentDevice]);
  }, []);

  const getDeviceType = (type: any): any => {
      // 简单映射，实际可用 Device.DeviceType 枚举
      return 'mobile'; 
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // 既然是单机/无后端应用，"下线"只能是象征性的，或者清除本地 Token
  const handleLogoutAllDevices = () => {
    Alert.alert(
      '提示',
      '由于当前为本地演示模式，无法控制其他物理设备。但在真实环境中，此操作将吊销 GitHub 授权令牌。',
      [
        { text: '知道了' }
      ]
    );
  };

  const getDeviceIcon = (type: string) => {
    return 'mobile-screen';
  };

  const getDeviceIconColor = (type: string) => {
    return '#10b981';
  };

  const getDeviceIconBgColor = (type: string) => {
    return '#f0fdf4';
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
        <Text style={styles.headerTitle}>设备管理</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 已登录设备卡片 */}
        <View style={styles.devicesCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>已登录设备</Text>
          </View>
          
          <View style={styles.devicesList}>
            {devices.map((device) => (
              <View
                key={device.id}
                style={styles.deviceItem}
              >
                <View style={styles.deviceInfo}>
                  <View style={[
                    styles.deviceIcon,
                    { backgroundColor: getDeviceIconBgColor(device.type) }
                  ]}>
                    <FontAwesome6 
                      name={getDeviceIcon(device.type)} 
                      size={16} 
                      color={getDeviceIconColor(device.type)} 
                    />
                  </View>
                  <View style={styles.deviceDetails}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Text style={styles.deviceLoginInfo}>
                      {device.isCurrentDevice 
                        ? `当前设备 · ${device.osName}`
                        : `${device.lastLogin}`
                      }
                    </Text>
                  </View>
                </View>
                
                <View style={styles.currentDeviceBadge}>
                   <Text style={styles.currentDeviceBadgeText}>在线</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 安全提示 */}
        <View style={styles.securityTip}>
          <FontAwesome6 name="circle-info" size={14} color="#3b82f6" style={styles.tipIcon} />
          <Text style={styles.tipText}>
            当前仅显示本机状态。
          </Text>
        </View>

        {/* 下线所有设备按钮 */}
        <View style={styles.logoutAllContainer}>
          <TouchableOpacity 
            style={styles.logoutAllButton} 
            onPress={handleLogoutAllDevices}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="shield-halved" size={14} color="#ef4444" style={styles.logoutAllIcon} />
            <Text style={styles.logoutAllText}>下线其他设备 (模拟)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageDevicesScreen;

