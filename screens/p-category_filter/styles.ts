

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  
  // 滚动视图
  scrollView: {
    flex: 1,
  },
  
  // 通用section样式
  section: {
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
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  
  sectionCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  // 搜索框
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  
  searchIcon: {
    marginRight: 8,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  
  // 已选条件
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  clearAllIcon: {
    marginRight: 4,
  },
  
  clearAllText: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  selectedFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  selectedFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#2563eb',
    borderRadius: 16,
  },
  
  selectedFilterIcon: {
    marginRight: 8,
  },
  
  selectedFilterText: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 8,
  },
  
  removeFilterButton: {
    padding: 2,
  },
  
  noSelectedFilters: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  
  noFiltersIcon: {
    marginBottom: 8,
  },
  
  noFiltersText: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // 筛选选项网格
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  
  filterOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  
  filterOptionTextSelected: {
    color: '#ffffff',
  },
  
  // 编程语言标签
  languageTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  
  languageTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // 项目类型图标
  projectTypeIcon: {
    marginRight: 8,
  },
});

