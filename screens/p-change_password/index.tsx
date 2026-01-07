

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import i18n from '../../services/i18n';
import styles from './styles';

const ChangePasswordScreen = () => {
  const router = useRouter();
  
  // 表单状态
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 返回按钮处理
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // 表单验证
  const validateForm = () => {
    if (!currentPassword.trim()) {
      Alert.alert(i18n.t('prompt'), i18n.t('enter_current_password'));
      return false;
    }

    if (!newPassword.trim()) {
      Alert.alert(i18n.t('prompt'), i18n.t('enter_new_password'));
      return false;
    }

    if (!confirmPassword.trim()) {
      Alert.alert(i18n.t('prompt'), i18n.t('enter_confirm_new_password'));
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(i18n.t('prompt'), i18n.t('password_mismatch'));
      return false;
    }

    if (newPassword.length < 8 || newPassword.length > 20) {
      Alert.alert(i18n.t('prompt'), i18n.t('password_length_error'));
      return false;
    }

    // 检查密码是否包含字母和数字
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      Alert.alert(i18n.t('prompt'), i18n.t('password_complexity_error'));
      return false;
    }

    return true;
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(i18n.t('success'), i18n.t('change_password_success'), [
        {
          text: i18n.t('confirm'),
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('change_password_failed'));
    } finally {
      setIsLoading(false);
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
        <Text style={styles.headerTitle}>{i18n.t('change_password')}</Text>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.formCard}>
            {/* 当前密码 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{i18n.t('current_password')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={i18n.t('enter_current_password')}
                placeholderTextColor="#9CA3AF"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* 新密码 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{i18n.t('new_password')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={i18n.t('enter_new_password')}
                placeholderTextColor="#9CA3AF"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.inputHint}>{i18n.t('password_hint')}</Text>
            </View>

            {/* 确认新密码 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{i18n.t('confirm_new_password')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={i18n.t('enter_confirm_new_password')}
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* 提交按钮 */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? i18n.t('changing_password') : i18n.t('confirm_change')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

