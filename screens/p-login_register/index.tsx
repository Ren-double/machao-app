import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import styles from './styles';
import { loginUser, registerUser, loginWithGitHub } from '../../services/auth';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../../config';
import i18n from '../../services/i18n';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/' + GITHUB_CLIENT_ID,
};

type LoginMethod = 'username' | 'github';

interface FormData {
  username: '';
  password: '';
}

interface FormErrors {
  username: string;
  password: string;
}

const LoginRegisterScreen: React.FC = () => {
  const router = useRouter();
  
  // State Management
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  // GitHub OAuth Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['read:user', 'user:email'],
      redirectUri: makeRedirectUri({
        scheme: 'myapp'
      }),
      responseType: ResponseType.Code,
    },
    discovery
  );

  // Handle GitHub Response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForToken(code);
    }
  }, [response]);

  const exchangeCodeForToken = async (code: string) => {
    setIsLoading(true);
    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: request?.redirectUri,
          code_verifier: request?.codeVerifier,
        }),
      });
      
      const tokenData = await tokenResponse.json();
      console.log('GitHub Token Response:', tokenData);
      
      if (tokenData.access_token) {
        fetchUserInfo(tokenData.access_token);
      } else {
        Alert.alert(i18n.t('login_failed'), tokenData.error_description || tokenData.error || i18n.t('token_error'));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      Alert.alert(i18n.t('login_failed'), i18n.t('github_auth_error'));
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/json',
        },
      });
      
      const userData = await userResponse.json();
      await loginWithGitHub(userData);
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error('User info error:', error);
      Alert.alert(i18n.t('login_failed'), i18n.t('fetch_user_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setIsSuccessModalVisible(false);
    router.replace('/p-home');
  };

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
          {/* Logo */}
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
                <Text style={styles.appTitle}>{i18n.t('app_name')}</Text>
                <Text style={styles.appSubtitle}>{i18n.t('app_slogan')}</Text>
              </View>
            </View>

            {/* GitHub Login Only */}
            <View style={styles.formContainer}>
              <View style={styles.githubDescriptionContainer}>
                <Text style={styles.githubDescription}>{i18n.t('github_login_desc')}</Text>
              </View>
              <TouchableOpacity
                style={[styles.githubLoginButton, isLoading ? styles.githubLoginButtonDisabled : null]}
                onPress={() => {
                  setIsLoading(true);
                  promptAsync();
                }}
                disabled={!request || isLoading}
              >
                <FontAwesome6 name="github" size={20} color="#ffffff" />
                <Text style={styles.githubLoginButtonText}>
                  {isLoading ? i18n.t('authorizing') : i18n.t('github_login')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
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
            <Text style={styles.modalTitle}>{i18n.t('login_success')}</Text>
            <Text style={styles.modalDescription}>{i18n.t('welcome_desc')}</Text>
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={handleSuccessConfirm}
            >
              <Text style={styles.modalConfirmButtonText}>{i18n.t('get_started')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LoginRegisterScreen;
