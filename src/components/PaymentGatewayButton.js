import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const PaymentGatewayButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { backgroundColor: '#FF6B35', padding: 12, borderRadius: 8, marginVertical: 6 },
  text: { color: '#FFF', textAlign: 'center', fontWeight: '600' },
});

export default PaymentGatewayButton;
