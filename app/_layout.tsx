import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, usePathname, useGlobalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorBoundary from '../components/ErrorBoundary';
import NetworkMonitor from '../components/NetworkMonitor';
import { getCurrentUser } from '../services/auth';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // 添加其它想暂时忽略的错误或警告信息
]);

const LANGUAGE_KEY = '@language_settings';

// Simple dictionary for demo purposes (since we don't have a full i18n lib)
const TITLES: any = {
  chinese: {
    tabs: "底部导航栏",
    p_project_detail: "项目详情页",
    p_category_filter: "分类筛选页",
    p_browse_history: "浏览历史页",
    p_interest_settings: "兴趣设置页",
    p_login_register: "登录/注册页",
    p_settings: "设置页",
    p_edit_profile: "编辑个人资料页",
    p_account_security: "账户安全页",
    p_help_feedback: "帮助与反馈页",
    p_about_app: "关于码潮页",
    p_change_password: "修改密码页",
    p_bind_phone: "绑定手机页",
    p_bind_email: "绑定邮箱页",
    p_manage_devices: "设备管理页",
    p_notification_settings: "通知设置页",
    p_language_settings: "语言设置页",
    p_data_collection: "数据收集设置页",
    p_account_issue: "账户问题页",
    p_function_usage: "功能使用页",
    p_payment_issue: "支付问题页",
    p_feedback_form: "意见反馈页",
    p_contact_email: "邮件联系页",
    p_terms_of_service: "使用条款页",
    p_privacy_policy: "隐私政策页"
  },
  english: {
    tabs: "Home",
    p_project_detail: "Project Detail",
    p_category_filter: "Category Filter",
    p_browse_history: "Browse History",
    p_interest_settings: "Interest Settings",
    p_login_register: "Login/Register",
    p_settings: "Settings",
    p_edit_profile: "Edit Profile",
    p_account_security: "Account Security",
    p_help_feedback: "Help & Feedback",
    p_about_app: "About App",
    p_change_password: "Change Password",
    p_bind_phone: "Bind Phone",
    p_bind_email: "Bind Email",
    p_manage_devices: "Manage Devices",
    p_notification_settings: "Notification Settings",
    p_language_settings: "Language Settings",
    p_data_collection: "Data Collection",
    p_account_issue: "Account Issues",
    p_function_usage: "Function Usage",
    p_payment_issue: "Payment Issues",
    p_feedback_form: "Feedback",
    p_contact_email: "Contact Email",
    p_terms_of_service: "Terms of Service",
    p_privacy_policy: "Privacy Policy"
  }
};

export default function RootLayout() {
  const pathname = usePathname();
  const searchParams = useGlobalSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState('chinese');

  useEffect(() => {
    const loadLang = async () => {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved) {
        setLang(saved);
      }
    };
    loadLang();
  }, []);

  const t = TITLES[lang] || TITLES['chinese'];

  useEffect(() => {
    // 检查登录状态
    const checkAuth = async () => {
      // 如果已经在登录页，不需要检查
      if (pathname === '/p-login_register') return;

      const user = await getCurrentUser();
      if (!user) {
        // 如果未登录，重定向到登录页
        // 使用 setTimeout 确保导航组件已准备好
        setTimeout(() => {
          router.replace('/p-login_register');
        }, 100);
      }
    };
    checkAuth();

    if (!pathname) {
      return;
    }
    let searchString = '';
    if (Object.keys(searchParams).length > 0) {
      const queryString = Object.keys(searchParams)
        .map(key => {
          const value = searchParams[key];
          if (typeof value === 'string') {
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          }
          return '';
        }).filter(Boolean).join('&');

      searchString = '?' + queryString;
    }

    const pageId = pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', pathname, ', search:', searchString);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: pathname,
        search: searchString,
      }, '*');
    }
  }, [pathname, searchParams])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <NetworkMonitor>
          <StatusBar style="dark"></StatusBar>
          <Stack screenOptions={{
            // 设置所有页面的切换动画为从右侧滑入，适用于iOS 和 Android
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            // 隐藏自带的头部
            headerShown: false 
          }}>
            <Stack.Screen name="(tabs)" options={{ title: t.tabs }} />
            <Stack.Screen name="p-project_detail" options={{ title: t.p_project_detail }} />
            <Stack.Screen name="p-category_filter" options={{ title: t.p_category_filter }} />
            <Stack.Screen name="p-browse_history" options={{ title: t.p_browse_history }} />
            <Stack.Screen name="p-interest_settings" options={{ title: t.p_interest_settings }} />
            <Stack.Screen name="p-login_register" options={{ title: t.p_login_register }} />
            <Stack.Screen name="p-settings" options={{ title: t.p_settings }} />
            <Stack.Screen name="p-edit_profile" options={{ title: t.p_edit_profile }} />
            <Stack.Screen name="p-account_security" options={{ title: t.p_account_security }} />
            <Stack.Screen name="p-help_feedback" options={{ title: t.p_help_feedback }} />
            <Stack.Screen name="p-about_app" options={{ title: t.p_about_app }} />
            <Stack.Screen name="p-change_password" options={{ title: t.p_change_password }} />
            <Stack.Screen name="p-bind_phone" options={{ title: t.p_bind_phone }} />
            <Stack.Screen name="p-bind_email" options={{ title: t.p_bind_email }} />
            <Stack.Screen name="p-manage_devices" options={{ title: t.p_manage_devices }} />
            <Stack.Screen name="p-notification_settings" options={{ title: t.p_notification_settings }} />
            <Stack.Screen name="p-language_settings" options={{ title: t.p_language_settings }} />
            <Stack.Screen name="p-data_collection" options={{ title: t.p_data_collection }} />
            <Stack.Screen name="p-account_issue" options={{ title: t.p_account_issue }} />
            <Stack.Screen name="p-function_usage" options={{ title: t.p_function_usage }} />
            <Stack.Screen name="p-payment_issue" options={{ title: t.p_payment_issue }} />
            <Stack.Screen name="p-feedback_form" options={{ title: t.p_feedback_form }} />
            <Stack.Screen name="p-contact_email" options={{ title: t.p_contact_email }} />
            <Stack.Screen name="p-terms_of_service" options={{ title: t.p_terms_of_service }} />
            <Stack.Screen name="p-privacy_policy" options={{ title: t.p_privacy_policy }} />
          </Stack>
        </NetworkMonitor>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
