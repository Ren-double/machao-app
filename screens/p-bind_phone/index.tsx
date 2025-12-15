

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

const BindPhoneScreen = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(60);
  const countdownTimerRef = useRef<number | null>(null);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    return phone.length === 11 && /^1[3-9]\d{9}$/.test(phone);
  };

  const handleSendVerificationCode = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('提示', '请输入正确的手机号码');
      return;
    }

    // 开始倒计时
    setIsCountdownActive(true);
    setCountdownSeconds(60);

    countdownTimerRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          setIsCountdownActive(false);
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    Alert.alert('提示', '验证码已发送');
  };

  const handleSubmit = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('提示', '请输入正确的手机号码');
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('提示', '请输入6位验证码');
      return;
    }

    Alert.alert('提示', '手机绑定成功', [
      {
        text: '确定',
        onPress: () => {
          if (router.canGoBack()) {
            router.back();
          }
        },
      },
    ]);
  };

  React.useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 顶部导航栏 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="chevron-left" size={16} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>绑定手机</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 主要内容区域 */}
          <View style={styles.mainContent}>
            <View style={styles.formCard}>
              {/* 手机号码输入 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>手机号码</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="请输入手机号码"
                  placeholderTextColor="#9CA3AF"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>

              {/* 验证码输入 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>验证码</Text>
                <View style={styles.verificationCodeWrapper}>
                  <TextInput
                    style={styles.verificationCodeInput}
                    placeholder="请输入验证码"
                    placeholderTextColor="#9CA3AF"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendCodeButton,
                      isCountdownActive && styles.sendCodeButtonDisabled,
                    ]}
                    onPress={handleSendVerificationCode}
                    disabled={isCountdownActive}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.sendCodeButtonText,
                        isCountdownActive && styles.sendCodeButtonTextDisabled,
                      ]}
                    >
                      {isCountdownActive
                        ? `${countdownSeconds}秒后重新获取`
                        : '获取验证码'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 确认绑定按钮 */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>确认绑定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BindPhoneScreen;

