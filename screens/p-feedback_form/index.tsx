

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from './styles';

type FeedbackType = 'bug' | 'suggestion' | 'compliment' | 'other' | '';

interface FeedbackFormData {
  feedbackType: FeedbackType;
  feedbackContent: string;
  contactInfo: string;
  uploadedImage: string | null;
}

const FeedbackFormScreen = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FeedbackFormData>({
    feedbackType: '',
    feedbackContent: '',
    contactInfo: '',
    uploadedImage: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypeOptions = [
    { key: 'bug' as FeedbackType, label: '功能异常' },
    { key: 'suggestion' as FeedbackType, label: '功能建议' },
    { key: 'compliment' as FeedbackType, label: '表扬鼓励' },
    { key: 'other' as FeedbackType, label: '其他问题' },
  ];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleFeedbackTypeSelect = (type: FeedbackType) => {
    setFormData(prev => ({ ...prev, feedbackType: type }));
  };

  const handleFeedbackContentChange = (text: string) => {
    if (text.length <= 500) {
      setFormData(prev => ({ ...prev, feedbackContent: text }));
    }
  };

  const handleContactInfoChange = (text: string) => {
    setFormData(prev => ({ ...prev, contactInfo: text }));
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('权限提示', '需要访问相册权限才能上传图片');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ 
          ...prev, 
          uploadedImage: result.assets[0].uri 
        }));
      }
    } catch (error) {
      Alert.alert('错误', '上传图片失败，请重试');
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, uploadedImage: null }));
  };

  const validateForm = (): boolean => {
    if (!formData.feedbackType) {
      Alert.alert('提示', '请选择反馈类型');
      return false;
    }

    if (!formData.feedbackContent.trim()) {
      Alert.alert('提示', '请填写反馈内容');
      return false;
    }

    if (formData.feedbackContent.length > 500) {
      Alert.alert('提示', '反馈内容不能超过500字');
      return false;
    }

    return true;
  };

  const handleSubmitFeedback = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 模拟提交API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        '提交成功',
        '反馈提交成功，感谢您的宝贵意见！',
        [
          {
            text: '确定',
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('提交失败', '网络错误，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFeedbackTypeButton = (option: { key: FeedbackType; label: string }) => {
    const isActive = formData.feedbackType === option.key;
    
    return (
      <TouchableOpacity
        key={option.key}
        style={[
          styles.feedbackTypeButton,
          isActive && styles.feedbackTypeButtonActive
        ]}
        onPress={() => handleFeedbackTypeSelect(option.key)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.feedbackTypeButtonText,
          isActive && styles.feedbackTypeButtonTextActive
        ]}>
          {option.label}
        </Text>
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>意见反馈</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 反馈表单 */}
        <View style={styles.formCard}>
          {/* 反馈类型 */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>反馈类型</Text>
            <View style={styles.feedbackTypeGrid}>
              {feedbackTypeOptions.map(renderFeedbackTypeButton)}
            </View>
          </View>

          {/* 反馈内容 */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>反馈内容</Text>
            <TextInput
              style={styles.feedbackContentInput}
              placeholder="请详细描述您遇到的问题或建议..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={formData.feedbackContent}
              onChangeText={handleFeedbackContentChange}
              maxLength={500}
            />
            <View style={styles.characterCounterContainer}>
              <Text style={[
                styles.characterCounter,
                formData.feedbackContent.length > 500 && styles.characterCounterError
              ]}>
                {formData.feedbackContent.length}/500
              </Text>
            </View>
          </View>

          {/* 联系方式 */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>联系方式（选填）</Text>
            <TextInput
              style={styles.contactInfoInput}
              placeholder="邮箱或手机号，方便我们联系您"
              placeholderTextColor="#9CA3AF"
              value={formData.contactInfo}
              onChangeText={handleContactInfoChange}
            />
          </View>

          {/* 上传截图 */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>上传截图（选填）</Text>
            
            {!formData.uploadedImage ? (
              <TouchableOpacity
                style={styles.imageUploadArea}
                onPress={handleImageUpload}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="cloud-arrow-up" size={24} color="#6B7280" />
                <Text style={styles.imageUploadText}>点击或拖拽图片到此处上传</Text>
                <Text style={styles.imageUploadSubText}>支持JPG、PNG格式，最大5MB</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: formData.uploadedImage }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={handleRemoveImage}
                  activeOpacity={0.7}
                >
                  <FontAwesome6 name="xmark" size={12} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 提交按钮 */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled
            ]}
            onPress={handleSubmitFeedback}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '提交中...' : '提交反馈'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 反馈须知 */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>反馈须知</Text>
          <View style={styles.noticeList}>
            <Text style={styles.noticeItem}>• 我们会认真对待每一条反馈，感谢您的支持</Text>
            <Text style={styles.noticeItem}>• 工作日内我们会在24小时内回复您的反馈</Text>
            <Text style={styles.noticeItem}>• 提供详细的问题描述和截图有助于我们更快解决问题</Text>
            <Text style={styles.noticeItem}>• 请遵守法律法规，文明用语</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackFormScreen;

