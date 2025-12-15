

import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface PaymentRecordProps {
  title: string;
  date: string;
  amount: string;
}

const PaymentRecord: React.FC<PaymentRecordProps> = ({
  title,
  date,
  amount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.amount}>{amount}</Text>
    </View>
  );
};

export default PaymentRecord;

