import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardChart = ({ title, series = [] }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {series.map((item) => (
      <Text key={`${title}-${item.label}`} style={styles.row}>• {item.label}: {Math.round(item.value).toLocaleString('ar-IQ')}</Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 12 },
  title: { fontWeight: '700', marginBottom: 8, textAlign: 'right' },
  row: { textAlign: 'right', marginBottom: 4 },
});

export default DashboardChart;
