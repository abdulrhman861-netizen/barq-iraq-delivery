import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardTable = ({ rows = [] }) => (
  <View style={styles.container}>
    {rows.map((row, index) => (
      <View key={`${row.label}-${index}`} style={styles.row}>
        <Text style={styles.value}>{row.value}</Text>
        <Text style={styles.label}>{row.label}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 12 },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 6 },
  label: { fontWeight: '600' },
  value: { color: '#333' },
});

export default DashboardTable;
