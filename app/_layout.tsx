import React, { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // 添加其它想暂时忽略的错误或警告信息
]);

export default function RootLayout() {
  const pathname = usePathname();
  const searchParams = useGlobalSearchParams();

  useEffect(() => {
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
      <StatusBar style="dark"></StatusBar>
      <Stack screenOptions={{
        // 设置所有页面的切换动画为从右侧滑入，适用于iOS 和 Android
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        // 隐藏自带的头部
        headerShown: false 
      }}>
        <Stack.Screen name="(tabs)" options={{ title: "底部导航栏" }} />
        <Stack.Screen name="p-project_detail" options={{ title: "项目详情页" }} />
        <Stack.Screen name="p-category_filter" options={{ title: "分类筛选页" }} />
        <Stack.Screen name="p-browse_history" options={{ title: "浏览历史页" }} />
        <Stack.Screen name="p-interest_settings" options={{ title: "兴趣设置页" }} />
        <Stack.Screen name="p-login_register" options={{ title: "登录/注册页" }} />
        <Stack.Screen name="p-settings" options={{ title: "设置页" }} />
        <Stack.Screen name="p-edit_profile" options={{ title: "编辑个人资料页" }} />
        <Stack.Screen name="p-account_security" options={{ title: "账户安全页" }} />
        <Stack.Screen name="p-help_feedback" options={{ title: "帮助与反馈页" }} />
        <Stack.Screen name="p-about_app" options={{ title: "关于码潮页" }} />
        <Stack.Screen name="p-change_password" options={{ title: "修改密码页" }} />
        <Stack.Screen name="p-bind_phone" options={{ title: "绑定手机页" }} />
        <Stack.Screen name="p-bind_email" options={{ title: "绑定邮箱页" }} />
        <Stack.Screen name="p-manage_devices" options={{ title: "设备管理页" }} />
        <Stack.Screen name="p-notification_settings" options={{ title: "通知设置页" }} />
        <Stack.Screen name="p-language_settings" options={{ title: "语言设置页" }} />
        <Stack.Screen name="p-data_collection" options={{ title: "数据收集设置页" }} />
        <Stack.Screen name="p-account_issue" options={{ title: "账户问题页" }} />
        <Stack.Screen name="p-function_usage" options={{ title: "功能使用页" }} />
        <Stack.Screen name="p-payment_issue" options={{ title: "支付问题页" }} />
        <Stack.Screen name="p-feedback_form" options={{ title: "意见反馈页" }} />
        <Stack.Screen name="p-contact_email" options={{ title: "邮件联系页" }} />
        <Stack.Screen name="p-terms_of_service" options={{ title: "使用条款页" }} />
        <Stack.Screen name="p-privacy_policy" options={{ title: "隐私政策页" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
