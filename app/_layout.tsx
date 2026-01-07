import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, usePathname, useGlobalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorBoundary from '../components/ErrorBoundary';
import NetworkMonitor from '../components/NetworkMonitor';
import { getCurrentUser } from '../services/auth';
import i18n, { initI18n } from '../services/i18n';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // 添加其它想暂时忽略的错误或警告信息
]);

export default function RootLayout() {
  const pathname = usePathname();
  const searchParams = useGlobalSearchParams();
  const router = useRouter();
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const [locale, setLocale] = useState(i18n.locale); // Force re-render on locale change

  useEffect(() => {
    const init = async () => {
      await initI18n();
      setIsI18nInitialized(true);
      setLocale(i18n.locale);
    };
    init();
  }, []);

  // Listen for language change events (custom simple event or polling, but for now we rely on Updates.reload or simple state if we pass it down)
  // Since p-language_settings reloads the app, initI18n will run again on start.

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

  if (!isI18nInitialized) {
    return null; // Or a splash screen
  }

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
            <Stack.Screen name="(tabs)" options={{ title: i18n.t('tabs') }} />
            <Stack.Screen name="p-project_detail" options={{ title: i18n.t('p_project_detail') }} />
            <Stack.Screen name="p-category_filter" options={{ title: i18n.t('p_category_filter') }} />
            <Stack.Screen name="p-browse_history" options={{ title: i18n.t('p_browse_history') }} />
            <Stack.Screen name="p-interest_settings" options={{ title: i18n.t('p_interest_settings') }} />
            <Stack.Screen name="p-login_register" options={{ title: i18n.t('p_login_register') }} />
            <Stack.Screen name="p-settings" options={{ title: i18n.t('p_settings') }} />
            <Stack.Screen name="p-edit_profile" options={{ title: i18n.t('p_edit_profile') }} />
            <Stack.Screen name="p-account_security" options={{ title: i18n.t('p_account_security') }} />
            <Stack.Screen name="p-help_feedback" options={{ title: i18n.t('p_help_feedback') }} />
            <Stack.Screen name="p-about_app" options={{ title: i18n.t('p_about_app') }} />
            <Stack.Screen name="p-change_password" options={{ title: i18n.t('p_change_password') }} />
            <Stack.Screen name="p-bind_phone" options={{ title: i18n.t('p_bind_phone') }} />
            <Stack.Screen name="p-bind_email" options={{ title: i18n.t('p_bind_email') }} />
            <Stack.Screen name="p-manage_devices" options={{ title: i18n.t('p_manage_devices') }} />
            <Stack.Screen name="p-notification_settings" options={{ title: i18n.t('p_notification_settings') }} />
            <Stack.Screen name="p-language_settings" options={{ title: i18n.t('p_language_settings') }} />
            <Stack.Screen name="p-data_collection" options={{ title: i18n.t('p_data_collection') }} />
            <Stack.Screen name="p-account_issue" options={{ title: i18n.t('p_account_issue') }} />
            <Stack.Screen name="p-function_usage" options={{ title: i18n.t('p_function_usage') }} />
            <Stack.Screen name="p-payment_issue" options={{ title: i18n.t('p_payment_issue') }} />
            <Stack.Screen name="p-feedback_form" options={{ title: i18n.t('p_feedback_form') }} />
            <Stack.Screen name="p-contact_email" options={{ title: i18n.t('p_contact_email') }} />
            <Stack.Screen name="p-terms_of_service" options={{ title: i18n.t('p_terms_of_service') }} />
            <Stack.Screen name="p-privacy_policy" options={{ title: i18n.t('p_privacy_policy') }} />
          </Stack>
        </NetworkMonitor>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
