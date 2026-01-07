

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import i18n from '../../services/i18n';
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
    { key: 'bug' as FeedbackType, label: i18n.t('feedback_type_bug') },
    { key: 'suggestion' as FeedbackType, label: i18n.t('feedback_type_suggestion') },
    { key: 'compliment' as FeedbackType, label: i18n.t('feedback_type_compliment') },
    { key: 'other' as FeedbackType, label: i18n.t('feedback_type_other') },
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
        Alert.alert(i18n.t('permission_alert_title'), i18n.t('permission_alert_msg'));
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
      Alert.alert(i18n.t('alert_error'), i18n.t('upload_failed'));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, uploadedImage: null }));
  };

  const validateForm = (): boolean => {
    if (!formData.feedbackType) {
      Alert.alert(i18n.t('alert_tip'), i18n.t('select_feedback_type'));
      return false;
    }

    if (!formData.feedbackContent.trim()) {
      Alert.alert(i18n.t('alert_tip'), i18n.t('enter_feedback_content'));
      return false;
    }

    if (formData.feedbackContent.length > 500) {
      Alert.alert(i18n.t('alert_tip'), i18n.t('feedback_length_limit'));
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
        i18n.t('submit_success'),
        i18n.t('submit_success_msg'),
        [
          {
            text: i18n.t('ok'),
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(i18n.t('submit_failed'), i18n.t('network_error_retry'));
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
        <Text style={styles.headerTitle}>{i18n.t('feedback_form_title')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 反馈表单 */}
        <View style={styles.formCard}>
          {/* 反馈类型 */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>{i18n.t('feedback_type_label')}</Text>
            <View style={styles.feedbackTypeGrid}>
              {feedbackTypeOptions.map(renderFeedbackTypeButton)}
            </View>
          </View>

          {/* 反馈内容 */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>{i18n.t('feedback_content_label')}</Text>
            <TextInput
              style={styles.feedbackContentInput}
              placeholder={i18n.t('feedback_content_placeholder')}
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
            <Text style={styles.formLabel}>{i18n.t('feedback_contact_label')}</Text>
            <TextInput
              style={styles.contactInfoInput}
              placeholder={i18n.t('feedback_contact_placeholder')}
              placeholderTextColor="#9CA3AF"
              value={formData.contactInfo}
              onChangeText={handleContactInfoChange}
            />
          </View>

          {/* 上传截图 */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>{i18n.t('feedback_image_label')}</Text>
            
            {!formData.uploadedImage ? (
              <TouchableOpacity
                style={styles.imageUploadArea}
                onPress={handleImageUpload}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="cloud-arrow-up" size={24} color="#6B7280" />
                <Text style={styles.imageUploadText}>{i18n.t('feedback_image_upload_text')}</Text>
                <Text style={styles.imageUploadSubText}>{i18n.t('feedback_image_upload_subtext')}</Text>
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
              {isSubmitting ? i18n.t('feedback_submitting') : i18n.t('feedback_submit_button')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 反馈须知 */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>{i18n.t('feedback_notice_title')}</Text>
          <View style={styles.noticeList}>
            <Text style={styles.noticeItem}>{i18n.t('feedback_notice_1')}</Text>
            <Text style={styles.noticeItem}>{i18n.t('feedback_notice_2')}</Text>
            <Text style={styles.noticeItem}>{i18n.t('feedback_notice_3')}</Text>
            <Text style={styles.noticeItem}>{i18n.t('feedback_notice_4')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackFormScreen;

