import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardStats = ({ stats = {} }) => (
  <View style={styles.container}>
    {Object.entries(stats).map(([key, value]) => (
      <View key={key} style={styles.item}>
        <Text style={styles.label}>{key}</Text>
        <Text style={styles.value}>{typeof value === 'number' ? value.toLocaleString('ar-IQ') : String(value)}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 12 },
  item: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#555' },
  value: { fontWeight: '700' },
});

export default DashboardStats;
