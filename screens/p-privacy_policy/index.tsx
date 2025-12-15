

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

const PrivacyPolicyScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleConfirmPress = () => {
    if (router.canGoBack()) {
      router.back();
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
        <Text style={styles.headerTitle}>隐私政策</Text>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 隐私政策内容卡片 */}
        <View style={styles.contentCard}>
          <View style={styles.cardContent}>
            {/* 标题部分 */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>码潮隐私政策</Text>
              <Text style={styles.updateDate}>更新日期：2023年6月1日</Text>
            </View>
            
            {/* 隐私政策内容 */}
            <View style={styles.privacyContent}>
              {/* 第1节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>1. 我们收集的信息</Text>
                <Text style={styles.sectionText}>
                  我们收集的信息包括但不限于：
                </Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>• 您提供的注册信息，如姓名、电子邮件地址、密码等</Text>
                  <Text style={styles.listItem}>• 您在使用我们服务时生成的信息，如代码片段、评论、点赞等</Text>
                  <Text style={styles.listItem}>• 设备信息，如IP地址、浏览器类型、操作系统等</Text>
                  <Text style={styles.listItem}>• 使用情况信息，如您访问的页面、点击的功能等</Text>
                </View>
              </View>
              
              {/* 第2节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>2. 我们如何使用您的信息</Text>
                <Text style={styles.sectionText}>
                  我们使用您的信息来：
                </Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>• 提供、维护和改进我们的服务</Text>
                  <Text style={styles.listItem}>• 处理您的注册、登录和账户管理</Text>
                  <Text style={styles.listItem}>• 发送服务通知、更新和安全警报</Text>
                  <Text style={styles.listItem}>• 响应您的请求和问题</Text>
                  <Text style={styles.listItem}>• 进行数据分析，以了解用户需求和改进服务</Text>
                  <Text style={styles.listItem}>• 防止欺诈和滥用</Text>
                </View>
              </View>
              
              {/* 第3节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>3. 信息共享与披露</Text>
                <Text style={styles.sectionText}>
                  我们不会出售您的个人信息。我们可能会在以下情况下共享您的信息：
                </Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>• 获得您的明确同意后</Text>
                  <Text style={styles.listItem}>• 与我们的关联公司、服务提供商和合作伙伴共享，以便他们为我们提供服务</Text>
                  <Text style={styles.listItem}>• 遵守法律法规、法律程序或政府要求</Text>
                  <Text style={styles.listItem}>• 保护码潮、我们的用户或公众的权利、财产或安全</Text>
                  <Text style={styles.listItem}>• 在涉及合并、收购、资产转让或类似的业务交易时</Text>
                </View>
              </View>
              
              {/* 第4节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>4. 信息安全</Text>
                <Text style={styles.sectionText}>
                  我们采取合理的安全措施来保护您的个人信息免受未经授权的访问、使用或披露。这些措施包括但不限于加密存储、访问控制、安全审计等。然而，请注意，互联网传输并非完全安全，我们无法保证您通过互联网传输的任何信息的安全性。
                </Text>
              </View>
              
              {/* 第5节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>5. Cookie和类似技术的使用</Text>
                <Text style={styles.sectionText}>
                  我们使用Cookie和类似技术来收集和存储您的信息，以提供更好的用户体验。您可以通过浏览器设置来管理或禁用Cookie，但这可能会影响我们服务的某些功能。
                </Text>
              </View>
              
              {/* 第6节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>6. 您的权利</Text>
                <Text style={styles.sectionText}>
                  根据适用法律，您可能享有以下权利：
                </Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>• 访问您的个人信息</Text>
                  <Text style={styles.listItem}>• 更正不准确的个人信息</Text>
                  <Text style={styles.listItem}>• 删除您的个人信息</Text>
                  <Text style={styles.listItem}>• 限制或反对个人信息的处理</Text>
                  <Text style={styles.listItem}>• 数据可携带权</Text>
                  <Text style={styles.listItem}>• 撤回同意的权利</Text>
                </View>
              </View>
              
              {/* 第7节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>7. 未成年人保护</Text>
                <Text style={styles.sectionText}>
                  我们非常重视对未成年人个人信息的保护。如果您是未满18周岁的未成年人，在使用我们的服务前，应当事先取得您的父母或法定监护人的同意。对于经父母或法定监护人同意而收集的未成年人的个人信息，我们只会在法律允许、父母或监护人明确同意或者保护未成年人所必要的情况下使用或公开披露此信息。
                </Text>
              </View>
              
              {/* 第8节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>8. 隐私政策的更新</Text>
                <Text style={styles.sectionText}>
                  我们可能会不时更新本隐私政策。当我们进行重大修改时，我们将通过在我们的网站上发布新政策或通过其他适当方式通知您。您继续使用我们的服务将构成您对修改后政策的接受。
                </Text>
              </View>
              
              {/* 第9节 */}
              <View style={styles.privacySection}>
                <Text style={styles.sectionTitle}>9. 联系我们</Text>
                <Text style={styles.sectionText}>
                  如果您对本隐私政策有任何问题或建议，请通过以下方式联系我们：
                </Text>
                <Text style={styles.contactText}>
                  电子邮件：privacy@machao.com{'\n'}
                  地址：北京市海淀区中关村科技园区
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* 确认按钮 */}
        <View style={styles.confirmSection}>
          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={handleConfirmPress}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>我已阅读并同意隐私政策</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

