import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatisticsCard = ({ title, value }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginBottom: 8 },
  title: { color: '#555', marginBottom: 4, textAlign: 'right' },
  value: { fontSize: 18, fontWeight: '700', textAlign: 'right' },
});

export default StatisticsCard;
