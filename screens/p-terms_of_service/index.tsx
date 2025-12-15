

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

const TermsOfServiceScreen = () => {
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
        <Text style={styles.headerTitle}>使用条款</Text>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* 使用条款内容卡片 */}
        <View style={styles.termsCard}>
          <View style={styles.cardContent}>
            {/* 标题部分 */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>码潮使用条款</Text>
              <Text style={styles.updateDate}>更新日期：2023年6月1日</Text>
            </View>
            
            {/* 条款内容 */}
            <View style={styles.termsContent}>
              {/* 第1条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>1. 接受条款</Text>
                <Text style={styles.sectionText}>
                  欢迎使用码潮！通过访问或使用我们的服务，您同意遵守本使用条款。如果您不同意本条款的任何部分，请不要使用我们的服务。
                </Text>
              </View>
              
              {/* 第2条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>2. 账户注册</Text>
                <Text style={styles.sectionText}>
                  您必须年满18岁才能使用我们的服务。在注册账户时，您需要提供准确、完整和最新的信息。您有责任维护账户的安全性和保密性。
                </Text>
              </View>
              
              {/* 第3条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>3. 用户行为规范</Text>
                <Text style={styles.sectionText}>
                  在使用我们的服务时，您同意：
                </Text>
                <View style={styles.bulletList}>
                  <Text style={styles.bulletItem}>• 遵守所有适用的法律法规</Text>
                  <Text style={styles.bulletItem}>• 不发布任何违法、侵权、淫秽、诽谤或其他不当内容</Text>
                  <Text style={styles.bulletItem}>• 不干扰或破坏我们的服务或服务器</Text>
                  <Text style={styles.bulletItem}>• 不尝试未经授权访问我们的服务或用户账户</Text>
                </View>
              </View>
              
              {/* 第4条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>4. 知识产权</Text>
                <Text style={styles.sectionText}>
                  码潮及其相关的所有内容、功能和材料（包括但不限于文本、图形、徽标、图标、图像、音频剪辑、数字下载、数据编译和软件）均为码潮或其许可方的财产，受中国和国际版权、商标和其他知识产权法律的保护。
                </Text>
              </View>
              
              {/* 第5条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>5. 用户内容</Text>
                <Text style={styles.sectionText}>
                  您保留对您在码潮上发布的所有内容的所有权。通过在码潮上发布内容，您授予我们全球性、非排他性、免版税、可转让的许可，以使用、复制、修改、分发、显示和表演您的内容。
                </Text>
              </View>
              
              {/* 第6条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>6. 服务变更</Text>
                <Text style={styles.sectionText}>
                  我们保留随时修改、暂停或终止我们的服务或其任何部分的权利，恕不另行通知。我们不对您或任何第三方因任何此类修改、暂停或终止而承担责任。
                </Text>
              </View>
              
              {/* 第7条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>7. 免责声明</Text>
                <Text style={styles.sectionText}>
                  我们的服务按"原样"提供，不附带任何形式的明示或暗示保证，包括但不限于适销性、特定用途的适用性和不侵权的保证。我们不保证我们的服务将不间断、及时、安全或无错误。
                </Text>
              </View>
              
              {/* 第8条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>8. 责任限制</Text>
                <Text style={styles.sectionText}>
                  在法律允许的最大范围内，码潮及其董事、高管、员工、合作伙伴、供应商或关联公司均不对任何间接、偶然、特殊、后果性或惩罚性损害承担责任，包括但不限于利润损失、数据损失、商誉损失、替代商品或服务的采购成本等。
                </Text>
              </View>
              
              {/* 第9条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>9. 条款修改</Text>
                <Text style={styles.sectionText}>
                  我们可能会不时修改本条款。当我们进行重大修改时，我们将通过在我们的网站上发布新条款或通过其他适当方式通知您。您继续使用我们的服务将构成您对修改后条款的接受。
                </Text>
              </View>
              
              {/* 第10条 */}
              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>10. 法律适用和争议解决</Text>
                <Text style={styles.sectionText}>
                  本条款的解释、效力及纠纷的解决，适用中华人民共和国法律。如就本条款发生任何争议，双方应友好协商解决；协商不成的，任何一方均有权将争议提交至码潮所在地有管辖权的人民法院诉讼解决。
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
            <Text style={styles.confirmButtonText}>我已阅读并同意使用条款</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfServiceScreen;

