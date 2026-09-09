import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentGatewayStatus = ({ status }) => (
  <View style={styles.container}>
    <Text style={styles.text}>حالة البوابة: {status || 'غير معروف'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#F5F5F5', borderRadius: 8, marginTop: 12 },
  text: { textAlign: 'right' },
});

export default PaymentGatewayStatus;
