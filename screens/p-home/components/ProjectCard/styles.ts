

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  bookmarkButtonActive: {
    backgroundColor: '#2563eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  bookmarkButtonInactive: {
    backgroundColor: '#e5e7eb',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
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
  dailyStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyStarsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10b981',
    marginLeft: 4,
  },
});

