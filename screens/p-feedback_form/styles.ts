

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  
  // 滚动视图
  scrollView: {
    flex: 1,
    paddingBottom: 80,
  },
  
  // 表单卡片
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  // 表单区块
  formSection: {
    marginBottom: 16,
  },
  
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  
  // 反馈类型选择
  feedbackTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  feedbackTypeButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  
  feedbackTypeButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  
  feedbackTypeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  
  feedbackTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  
  // 反馈内容输入框
  feedbackContentInput: {
    height: 160,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  
  characterCounterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  
  characterCounter: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  characterCounterError: {
    color: '#EF4444',
  },
  
  // 联系方式输入框
  contactInfoInput: {
    height: 48,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  
  // 图片上传区域
  imageUploadArea: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  
  imageUploadText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  
  imageUploadSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  
  // 图片预览
  imagePreviewContainer: {
    position: 'relative',
    marginTop: 12,
  },
  
  previewImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  
  // 提交按钮
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  
  // 反馈须知卡片
  noticeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  noticeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  
  noticeList: {
    gap: 4,
  },
  
  noticeItem: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});

