import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QRCodeGenerator = ({ value }) => (
  <View style={styles.container}>
    <Text style={styles.title}>QR Code (TOTP)</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 12, borderRadius: 8, backgroundColor: '#FFF', marginVertical: 8 },
  title: { textAlign: 'center', marginBottom: 6, fontWeight: '700' },
  value: { textAlign: 'center', color: '#333' },
});

export default QRCodeGenerator;
