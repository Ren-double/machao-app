

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
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
      Alert.alert('提示', '请输入当前密码');
      return false;
    }

    if (!newPassword.trim()) {
      Alert.alert('提示', '请输入新密码');
      return false;
    }

    if (!confirmPassword.trim()) {
      Alert.alert('提示', '请确认新密码');
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('提示', '两次输入的新密码不一致');
      return false;
    }

    if (newPassword.length < 8 || newPassword.length > 20) {
      Alert.alert('提示', '密码长度应为8-20位');
      return false;
    }

    // 检查密码是否包含字母和数字
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      Alert.alert('提示', '密码必须包含字母和数字');
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
      
      Alert.alert('成功', '密码修改成功', [
        {
          text: '确定',
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '密码修改失败，请重试');
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
        <Text style={styles.headerTitle}>修改密码</Text>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.formCard}>
            {/* 当前密码 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>当前密码</Text>
              <TextInput
                style={styles.textInput}
                placeholder="请输入当前密码"
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
              <Text style={styles.inputLabel}>新密码</Text>
              <TextInput
                style={styles.textInput}
                placeholder="请输入新密码"
                placeholderTextColor="#9CA3AF"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.inputHint}>密码长度8-20位，包含字母和数字</Text>
            </View>

            {/* 确认新密码 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>确认新密码</Text>
              <TextInput
                style={styles.textInput}
                placeholder="请再次输入新密码"
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
                {isLoading ? '修改中...' : '确认修改'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

