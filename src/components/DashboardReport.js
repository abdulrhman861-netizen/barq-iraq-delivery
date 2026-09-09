import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardReport = ({ title, description }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 12 },
  title: { fontWeight: '700', marginBottom: 6, textAlign: 'right' },
  description: { color: '#666', textAlign: 'right' },
});

export default DashboardReport;
