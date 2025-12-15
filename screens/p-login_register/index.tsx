

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import styles from './styles';

type LoginMethod = 'phone' | 'github';

interface FormData {
  phoneNumber: string;
  verificationCode: string;
}

interface FormErrors {
  phoneNumber: string;
  verificationCode: string;
}

const LoginRegisterScreen: React.FC = () => {
  const router = useRouter();
  
  // 状态管理
  const [activeLoginMethod, setActiveLoginMethod] = useState<LoginMethod>('phone');
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    verificationCode: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    phoneNumber: '',
    verificationCode: '',
  });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isPhoneLoginLoading, setIsPhoneLoginLoading] = useState(false);
  const [isGithubLoginLoading, setIsGithubLoginLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  
  const countdownIntervalRef = useRef<number | null>(null);

  // 验证手机号
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 验证验证码
  const validateVerificationCode = (code: string): boolean => {
    return code.length === 6 && /^\d{6}$/.test(code);
  };

  // 处理Tab切换
  const handleTabSwitch = (method: LoginMethod) => {
    setActiveLoginMethod(method);
    // 清除错误信息
    setFormErrors({
      phoneNumber: '',
      verificationCode: '',
    });
    setIsCodeSent(false);
  };

  // 处理手机号输入
  const handlePhoneNumberChange = (text: string) => {
    // 只允许输入数字
    const numericText = text.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phoneNumber: numericText }));
    // 清除错误信息
    if (formErrors.phoneNumber) {
      setFormErrors(prev => ({ ...prev, phoneNumber: '' }));
    }
  };

  // 处理验证码输入
  const handleVerificationCodeChange = (text: string) => {
    // 只允许输入数字
    const numericText = text.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, verificationCode: numericText }));
    // 清除错误信息
    if (formErrors.verificationCode) {
      setFormErrors(prev => ({ ...prev, verificationCode: '' }));
    }
  };

  // 获取验证码
  const handleGetVerificationCode = () => {
    if (countdown > 0) return;

    const phone = formData.phoneNumber.trim();
    
    if (!phone) {
      setFormErrors(prev => ({ ...prev, phoneNumber: '请输入手机号' }));
      return;
    }
    
    if (!validatePhoneNumber(phone)) {
      setFormErrors(prev => ({ ...prev, phoneNumber: '请输入正确的手机号' }));
      return;
    }

    setFormErrors(prev => ({ ...prev, phoneNumber: '' }));
    
    // 开始倒计时
    setCountdown(60);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // 模拟发送验证码
    setTimeout(() => {
      setIsCodeSent(true);
      setTimeout(() => {
        setIsCodeSent(false);
      }, 3000);
    }, 500);
  };

  // 手机号登录
  const handlePhoneLogin = async () => {
    const { phoneNumber, verificationCode } = formData;
    
    // 验证手机号
    if (!phoneNumber.trim()) {
      setFormErrors(prev => ({ ...prev, phoneNumber: '请输入手机号' }));
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      setFormErrors(prev => ({ ...prev, phoneNumber: '请输入正确的手机号' }));
      return;
    }
    
    // 验证验证码
    if (!verificationCode.trim()) {
      setFormErrors(prev => ({ ...prev, verificationCode: '请输入验证码' }));
      return;
    }
    
    if (!validateVerificationCode(verificationCode)) {
      setFormErrors(prev => ({ ...prev, verificationCode: '请输入6位数字验证码' }));
      return;
    }

    setFormErrors({
      phoneNumber: '',
      verificationCode: '',
    });
    
    setIsPhoneLoginLoading(true);
    
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 显示成功模态框
      setIsSuccessModalVisible(true);
    } catch (error) {
      Alert.alert('登录失败', '请检查网络连接后重试');
    } finally {
      setIsPhoneLoginLoading(false);
    }
  };

  // GitHub登录
  const handleGithubLogin = async () => {
    setIsGithubLoginLoading(true);
    
    try {
      // 模拟GitHub授权过程
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 显示成功模态框
      setIsSuccessModalVisible(true);
    } catch (error) {
      Alert.alert('登录失败', 'GitHub授权失败，请重试');
    } finally {
      setIsGithubLoginLoading(false);
    }
  };

  // 成功模态框确认
  const handleSuccessConfirm = () => {
    setIsSuccessModalVisible(false);
    // 导航到首页
    router.replace('/p-home');
  };

  // 处理用户协议点击
  const handleUserAgreementPress = () => {
    // 在实际应用中，这里会打开用户协议页面
    console.log('打开用户协议页面');
  };

  // 处理隐私政策点击
  const handlePrivacyPolicyPress = () => {
    // 在实际应用中，这里会打开隐私政策页面
    console.log('打开隐私政策页面');
  };

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo区域 */}
          <View style={styles.logoSection}>
            <View style={styles.appLogo}>
              <LinearGradient
                colors={['#2563eb', '#10b981']}
                style={styles.logoIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome6 name="code" size={24} color="#ffffff" />
              </LinearGradient>
              <View style={styles.logoTextContainer}>
                <Text style={styles.appTitle}>码潮</Text>
                <Text style={styles.appSubtitle}>发现优质开源项目</Text>
              </View>
            </View>

            {/* 登录方式切换Tab */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeLoginMethod === 'phone' ? styles.tabButtonActive : styles.tabButtonInactive
                ]}
                onPress={() => handleTabSwitch('phone')}
              >
                <FontAwesome6 
                  name="mobile-screen" 
                  size={16} 
                  color={activeLoginMethod === 'phone' ? '#ffffff' : '#6b7280'} 
                  style={styles.tabIcon}
                />
                <Text style={[
                  styles.tabText,
                  activeLoginMethod === 'phone' ? styles.tabTextActive : styles.tabTextInactive
                ]}>
                  手机号登录
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeLoginMethod === 'github' ? styles.tabButtonActive : styles.tabButtonInactive
                ]}
                onPress={() => handleTabSwitch('github')}
              >
                <FontAwesome6 
                  name="github" 
                  size={16} 
                  color={activeLoginMethod === 'github' ? '#ffffff' : '#6b7280'} 
                  style={styles.tabIcon}
                />
                <Text style={[
                  styles.tabText,
                  activeLoginMethod === 'github' ? styles.tabTextActive : styles.tabTextInactive
                ]}>
                  GitHub登录
                </Text>
              </TouchableOpacity>
            </View>

            {/* 手机号登录表单 */}
            {activeLoginMethod === 'phone' && (
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>手机号</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      formErrors.phoneNumber ? styles.textInputError : null
                    ]}
                    placeholder="请输入手机号"
                    value={formData.phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    keyboardType="numeric"
                    maxLength={11}
                    placeholderTextColor="#9ca3af"
                  />
                  {formErrors.phoneNumber ? (
                    <Text style={styles.errorMessage}>{formErrors.phoneNumber}</Text>
                  ) : null}
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>验证码</Text>
                  <View style={styles.codeInputContainer}>
                    <TextInput
                      style={[
                        styles.codeInput,
                        formErrors.verificationCode ? styles.textInputError : null
                      ]}
                      placeholder="请输入验证码"
                      value={formData.verificationCode}
                      onChangeText={handleVerificationCodeChange}
                      keyboardType="numeric"
                      maxLength={6}
                      placeholderTextColor="#9ca3af"
                    />
                    <TouchableOpacity
                      style={[
                        styles.getCodeButton,
                        countdown > 0 ? styles.getCodeButtonDisabled : null
                      ]}
                      onPress={handleGetVerificationCode}
                      disabled={countdown > 0}
                    >
                      <Text style={[
                        styles.getCodeButtonText,
                        countdown > 0 ? styles.getCodeButtonTextDisabled : null
                      ]}>
                        {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {formErrors.verificationCode ? (
                    <Text style={styles.errorMessage}>{formErrors.verificationCode}</Text>
                  ) : null}
                  {isCodeSent ? (
                    <Text style={styles.successMessage}>验证码已发送</Text>
                  ) : null}
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isPhoneLoginLoading ? styles.loginButtonDisabled : null
                  ]}
                  onPress={handlePhoneLogin}
                  disabled={isPhoneLoginLoading}
                >
                  {isPhoneLoginLoading && (
                    <FontAwesome6 
                      name="spinner" 
                      size={16} 
                      color="#ffffff" 
                      style={styles.loadingIcon}
                    />
                  )}
                  <Text style={styles.loginButtonText}>
                    {isPhoneLoginLoading ? '登录中...' : '登录/注册'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* GitHub登录表单 */}
            {activeLoginMethod === 'github' && (
              <View style={styles.formContainer}>
                <View style={styles.githubDescriptionContainer}>
                  <Text style={styles.githubDescription}>使用GitHub账号快速登录</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.githubLoginButton,
                    isGithubLoginLoading ? styles.githubLoginButtonDisabled : null
                  ]}
                  onPress={handleGithubLogin}
                  disabled={isGithubLoginLoading}
                >
                  <FontAwesome6 name="github" size={20} color="#ffffff" />
                  <Text style={styles.githubLoginButtonText}>
                    {isGithubLoginLoading ? '授权中...' : 'GitHub登录'}
                  </Text>
                  {isGithubLoginLoading && (
                    <FontAwesome6 
                      name="spinner" 
                      size={16} 
                      color="#ffffff" 
                      style={styles.githubLoadingIcon}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 用户协议区域 */}
          <View style={styles.agreementSection}>
            <Text style={styles.agreementText}>
              登录即表示同意
              <Text style={styles.agreementLink} onPress={handleUserAgreementPress}>
                《用户协议》
              </Text>
              和
              <Text style={styles.agreementLink} onPress={handlePrivacyPolicyPress}>
                《隐私政策》
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 成功提示模态框 */}
      <Modal
        visible={isSuccessModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <FontAwesome6 name="check" size={24} color="#ffffff" />
            </View>
            <Text style={styles.modalTitle}>登录成功</Text>
            <Text style={styles.modalDescription}>欢迎使用码潮，发现优质开源项目</Text>
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={handleSuccessConfirm}
            >
              <Text style={styles.modalConfirmButtonText}>开始使用</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LoginRegisterScreen;

