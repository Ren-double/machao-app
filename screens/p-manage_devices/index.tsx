

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'laptop' | 'tablet';
  browser?: string;
  lastLogin: string;
  isCurrentDevice: boolean;
}

const ManageDevicesScreen = () => {
  const router = useRouter();
  
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'iPhone 13 Pro',
      type: 'mobile',
      lastLogin: '今天 09:30',
      isCurrentDevice: true,
    },
    {
      id: '2',
      name: 'MacBook Pro',
      type: 'laptop',
      browser: 'Chrome',
      lastLogin: '昨天 15:45',
      isCurrentDevice: false,
    },
    {
      id: '3',
      name: 'iPad Pro',
      type: 'tablet',
      browser: 'Safari',
      lastLogin: '3天前',
      isCurrentDevice: false,
    },
  ]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleLogoutDevice = (deviceId: string) => {
    Alert.alert(
      '确认下线',
      '确定要将此设备下线吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            setDevices(prevDevices => 
              prevDevices.filter(device => device.id !== deviceId)
            );
            Alert.alert('提示', '设备已下线');
          },
        },
      ]
    );
  };

  const handleLogoutAllDevices = () => {
    Alert.alert(
      '确认下线所有设备',
      '确定要下线所有其他设备吗？这将使您在其他设备上的登录状态失效。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            setDevices(prevDevices => 
              prevDevices.filter(device => device.isCurrentDevice)
            );
            Alert.alert('提示', '所有其他设备已下线');
          },
        },
      ]
    );
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return 'mobile-screen';
      case 'laptop':
        return 'laptop';
      case 'tablet':
        return 'tablet-screen-button';
      default:
        return 'mobile-screen';
    }
  };

  const getDeviceIconColor = (type: string) => {
    switch (type) {
      case 'mobile':
        return '#10b981';
      case 'laptop':
        return '#3b82f6';
      case 'tablet':
        return '#8b5cf6';
      default:
        return '#10b981';
    }
  };

  const getDeviceIconBgColor = (type: string) => {
    switch (type) {
      case 'mobile':
        return '#f0fdf4';
      case 'laptop':
        return '#eff6ff';
      case 'tablet':
        return '#faf5ff';
      default:
        return '#f0fdf4';
    }
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
              <TouchableOpacity
                key={device.id}
                style={styles.deviceItem}
                activeOpacity={device.isCurrentDevice ? 1 : 0.7}
                onPress={() => !device.isCurrentDevice && handleLogoutDevice(device.id)}
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
                        ? `当前设备 · ${device.lastLogin}`
                        : `${device.browser} · ${device.lastLogin}`
                      }
                    </Text>
                  </View>
                </View>
                
                {device.isCurrentDevice ? (
                  <View style={styles.currentDeviceBadge}>
                    <Text style={styles.currentDeviceBadgeText}>当前</Text>
                  </View>
                ) : (
                  <Text style={styles.logoutButton}>下线</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 安全提示 */}
        <View style={styles.securityTip}>
          <FontAwesome6 name="circle-info" size={14} color="#3b82f6" style={styles.tipIcon} />
          <Text style={styles.tipText}>
            如发现未授权的登录设备，请立即下线并修改密码以保障账户安全。
          </Text>
        </View>

        {/* 下线所有设备按钮 */}
        <View style={styles.logoutAllContainer}>
          <TouchableOpacity 
            style={styles.logoutAllButton} 
            onPress={handleLogoutAllDevices}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="right-from-bracket" size={14} color="#ef4444" style={styles.logoutAllIcon} />
            <Text style={styles.logoutAllText}>下线所有其他设备</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageDevicesScreen;

