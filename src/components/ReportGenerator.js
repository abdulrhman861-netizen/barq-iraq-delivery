import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ReportGenerator = ({ onGenerate }) => (
  <TouchableOpacity style={styles.button} onPress={onGenerate}>
    <Text style={styles.text}>توليد التقرير</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { backgroundColor: '#1FBF83', padding: 12, borderRadius: 8, marginVertical: 10 },
  text: { color: '#FFF', textAlign: 'center', fontWeight: '700' },
});

export default ReportGenerator;
