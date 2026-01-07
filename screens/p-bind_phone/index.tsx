

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import i18n from '../../services/i18n';
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
      Alert.alert(i18n.t('prompt'), i18n.t('invalid_phone_number'));
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

    Alert.alert(i18n.t('prompt'), i18n.t('code_sent'));
  };

  const handleSubmit = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert(i18n.t('prompt'), i18n.t('invalid_phone_number'));
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert(i18n.t('prompt'), i18n.t('enter_6_digit_code'));
      return;
    }

    Alert.alert(i18n.t('prompt'), i18n.t('phone_bind_success'), [
      {
        text: i18n.t('confirm'),
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
          <Text style={styles.headerTitle}>{i18n.t('bind_phone')}</Text>
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
                <Text style={styles.inputLabel}>{i18n.t('phone_number')}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={i18n.t('enter_phone_number')}
                  placeholderTextColor="#9CA3AF"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>

              {/* 验证码输入 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{i18n.t('verification_code')}</Text>
                <View style={styles.verificationCodeWrapper}>
                  <TextInput
                    style={styles.verificationCodeInput}
                    placeholder={i18n.t('enter_verification_code')}
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
                        ? i18n.t('resend_code_after', { count: countdownSeconds })
                        : i18n.t('get_verification_code')}
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
                <Text style={styles.submitButtonText}>{i18n.t('confirm_bind')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BindPhoneScreen;

