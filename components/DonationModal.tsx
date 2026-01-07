import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import i18n from '../services/i18n';

interface DonationModalProps {
  visible: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{i18n.t('support_us')}</Text>
          <Text style={styles.modalSubtitle}>{i18n.t('donate_desc')}</Text>
          
          <View style={styles.qrCodeContainer}>
            {/* 
              === 使用说明 ===
              1. 请将您的微信/支付宝收款码图片重命名为 payment-qr.png
              2. 将图片放入 assets/images/ 目录下
              3. 取消下方 Image 组件的注释，并注释掉下面的 qrCodePlaceholder 部分
            */}
            
            <Image source={require('../assets/images/payment-qr.png')} style={styles.qrCode} resizeMode="contain" />

            {/* <View style={styles.qrCodePlaceholder}>
              <FontAwesome6 name="qrcode" size={64} color="#d1d5db" />
              <Text style={styles.qrCodePlaceholderText}>{i18n.t('qr_code_placeholder')}</Text>
            </View> */}
          </View>

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>{i18n.t('close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '80%',
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrCodeContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    overflow: 'hidden', // 确保图片圆角
  },
  qrCode: {
    width: '100%',
    height: '100%',
  },
  qrCodePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodePlaceholderText: {
    marginTop: 12,
    fontSize: 12,
    color: '#9ca3af',
  },
  closeButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DonationModal;
