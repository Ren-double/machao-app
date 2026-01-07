

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import i18n from '../../services/i18n';
import styles from './styles';

const BindEmailScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSending, setIsCodeSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownTimerRef = useRef<number | null>(null);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleSendVerificationCode = async () => {
    if (!email || !validateEmail(email)) {
      Alert.alert(i18n.t('prompt'), i18n.t('invalid_email'));
      return;
    }

    setIsCodeSending(true);
    
    try {
      // 模拟发送验证码API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(i18n.t('prompt'), i18n.t('code_sent_to_email'));
      
      // 开始倒计时
      setCountdown(60);
      countdownTimerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('send_failed'));
    } finally {
      setIsCodeSending(false);
    }
  };

  const handleSubmit = async () => {
    if (!email || !validateEmail(email)) {
      Alert.alert(i18n.t('prompt'), i18n.t('invalid_email'));
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert(i18n.t('prompt'), i18n.t('enter_6_digit_code'));
      return;
    }

    try {
      // 模拟绑定邮箱API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(i18n.t('success'), i18n.t('email_bind_success'), [
        {
          text: i18n.t('confirm'),
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            }
          }
        }
      ]);
      
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('bind_failed'));
    }
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
          <Text style={styles.headerTitle}>{i18n.t('bind_email')}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 主要内容区域 */}
          <View style={styles.mainContent}>
            <View style={styles.formCard}>
              {/* 邮箱输入框 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{i18n.t('email')}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={i18n.t('enter_email')}
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* 验证码输入框 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{i18n.t('verification_code')}</Text>
                <View style={styles.verificationCodeWrapper}>
                  <TextInput
                    style={styles.verificationCodeInput}
                    placeholder={i18n.t('enter_verification_code')}
                    placeholderTextColor="#9CA3AF"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendCodeButton,
                      (isCodeSending || countdown > 0) && styles.sendCodeButtonDisabled
                    ]}
                    onPress={handleSendVerificationCode}
                    disabled={isCodeSending || countdown > 0}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.sendCodeButtonText,
                      (isCodeSending || countdown > 0) && styles.sendCodeButtonTextDisabled
                    ]}>
                      {isCodeSending 
                        ? i18n.t('sending') 
                        : countdown > 0 
                          ? i18n.t('resend_code_after', { count: countdown })
                          : i18n.t('get_verification_code')
                      }
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 提交按钮 */}
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

export default BindEmailScreen;

