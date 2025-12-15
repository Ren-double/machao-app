

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // 顶部导航栏
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  bookmarkedButton: {
    backgroundColor: '#dbeafe',
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  // 滚动视图
  scrollView: {
    flex: 1,
  },

  // 项目信息卡片
  projectInfoCard: {
    backgroundColor: '#ffffff',
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
  
  projectInfoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  projectInfoContent: {
    flex: 1,
    marginRight: 16,
  },
  
  projectName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  
  projectAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  
  projectDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  
  projectAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  // 统计信息
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginBottom: 16,
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 4,
  },
  
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },

  // 元信息
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  
  languageTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  
  languageTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  languageJavaScript: {
    backgroundColor: '#fef3c7',
  },
  
  languagePython: {
    backgroundColor: '#dbeafe',
  },
  
  languageJava: {
    backgroundColor: '#dcfce7',
  },
  
  languageGo: {
    backgroundColor: '#fef2f2',
  },
  
  lastUpdated: {
    fontSize: 12,
    color: '#6b7280',
  },

  // 趋势图卡片
  trendCard: {
    backgroundColor: '#ffffff',
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
  
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  trendTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  
  trendPeriodContainer: {
    flexDirection: 'row',
  },
  
  trendPeriodButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginLeft: 8,
  },
  
  trendPeriodButtonActive: {
    backgroundColor: '#2563eb',
  },
  
  trendPeriodButtonText: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  trendPeriodButtonTextActive: {
    color: '#ffffff',
  },

  // 图表容器
  chartContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },

  // 趋势增长
  trendGrowthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  trendGrowthLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  trendGrowthText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
    marginLeft: 8,
  },
  
  trendGrowthPercent: {
    fontSize: 12,
    color: '#6b7280',
  },

  // 链接卡片
  linksCard: {
    backgroundColor: '#ffffff',
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
  
  linksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  
  linksContainer: {
    gap: 12,
  },
  
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  
  linkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  linkItemText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },

  // 底部操作栏
  bottomActionBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    paddingBottom: Platform.select({
      ios: 34, // iPhone底部安全区域
      android: 16,
    }),
  },
  
  githubButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  githubButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },

  // 轻提示
  toast: {
    position: 'absolute',
    top: 80,
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  
  toastText: {
    color: '#ffffff',
    fontSize: 14,
  },

  // 底部间距
  bottomSpacing: {
    height: 100,
  },
});

