

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    marginLeft: 12,
    gap: 4,
  },
  languageTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  languageText: {
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
  languageTypeScript: {
    backgroundColor: '#e0e7ff',
  },
  languageRust: {
    backgroundColor: '#fef3c7',
  },
  languageCpp: {
    backgroundColor: '#dbeafe',
  },
  languageSwift: {
    backgroundColor: '#fef2f2',
  },
  languageDefault: {
    backgroundColor: '#f3f4f6',
  },
});

