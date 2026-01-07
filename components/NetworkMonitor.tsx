import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { FontAwesome6 } from '@expo/vector-icons';

import i18n from '../services/i18n';

interface Props {
  children: React.ReactNode;
}

const NetworkMonitor: React.FC<Props> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isConnected === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <FontAwesome6 name="wifi" size={64} color="#ef4444" />
          <Text style={styles.title}>{i18n.t('network_disconnected')}</Text>
          <Text style={styles.message}>
            {i18n.t('network_disconnected_desc')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1f2937',
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default NetworkMonitor;
