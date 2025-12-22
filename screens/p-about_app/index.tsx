

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

const AboutAppScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleTermsPress = () => {
    router.push('/p-terms_of_service');
  };

  const handlePrivacyPress = () => {
    router.push('/p-privacy_policy');
  };

  const handleSocialPress = async (platform: string, url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('提示', `无法打开${platform}应用`);
      }
    } catch (error) {
      Alert.alert('错误', '打开链接时发生错误');
    }
  };

  const handleWeiboPress = () => {
    handleSocialPress('微博', '该功能还在开发中，敬请期待');
  };

  const handleWechatPress = () => {
    Alert.alert('微信公众号', '该功能还在开发中，敬请期待');
  };

  const handleGithubPress = () => {
    handleSocialPress('GitHub', 'https://github.com/Ren-double');
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
        <Text style={styles.headerTitle}>关于码潮</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 应用信息 */}
        <View style={styles.appInfoSection}>
          <View style={styles.appIconContainer}>
            <FontAwesome6 name="code" size={32} color="#ffffff" />
          </View>
          <Text style={styles.appName}>码潮</Text>
          <Text style={styles.appVersion}>版本 1.0.0</Text>
          <Text style={styles.appDescription}>
            码潮是一款专为开发者打造的代码分享和学习平台，让编程变得更加简单有趣。
          </Text>
        </View>

        {/* 法律信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>法律信息</Text>
          <View style={styles.menuList}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleTermsPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.menuIconContainer, styles.termsIconContainer]}>
                  <FontAwesome6 name="file-contract" size={16} color="#3b82f6" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>使用条款</Text>
                  <Text style={styles.menuSubtitle}>查看用户协议</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handlePrivacyPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.menuIconContainer, styles.privacyIconContainer]}>
                  <FontAwesome6 name="user-shield" size={16} color="#10b981" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>隐私政策</Text>
                  <Text style={styles.menuSubtitle}>查看隐私保护说明</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 社交媒体 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关注我们</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={styles.socialItem} 
              onPress={handleWeiboPress}
              activeOpacity={0.7}
            >
              <View style={[styles.socialIconContainer, styles.weiboIconContainer]}>
                <FontAwesome6 name="weibo" size={20} color="#ef4444" />
              </View>
              <Text style={styles.socialLabel}>微博</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialItem} 
              onPress={handleWechatPress}
              activeOpacity={0.7}
            >
              <View style={[styles.socialIconContainer, styles.wechatIconContainer]}>
                <FontAwesome6 name="weixin" size={20} color="#10b981" />
              </View>
              <Text style={styles.socialLabel}>微信</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialItem} 
              onPress={handleGithubPress}
              activeOpacity={0.7}
            >
              <View style={[styles.socialIconContainer, styles.githubIconContainer]}>
                <FontAwesome6 name="github" size={20} color="#374151" />
              </View>
              <Text style={styles.socialLabel}>GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 版权信息 */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            © 2023 码潮团队 版权所有
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutAppScreen;

