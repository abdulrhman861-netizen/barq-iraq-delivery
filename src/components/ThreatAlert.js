import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ThreatAlert = ({ alert }) => (
  <View style={styles.container}>
    <Text style={styles.level}>المستوى: {alert.level}</Text>
    <Text style={styles.score}>النتيجة: {alert.score}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 12, borderRadius: 8, backgroundColor: '#FFF3E0', marginBottom: 8 },
  level: { fontWeight: '700', textAlign: 'right' },
  score: { textAlign: 'right', color: '#555' },
});

export default ThreatAlert;
