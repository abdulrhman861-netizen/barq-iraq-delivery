import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SessionsList = ({ sessions = [], onLogoutSession }) => (
  <View>
    {sessions.map((session) => (
      <View key={session.id} style={styles.item}>
        <View>
          <Text style={styles.device}>{session.deviceId || 'جهاز غير معروف'}</Text>
          <Text style={styles.date}>{session.createdAt}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => onLogoutSession(session.id)}>
          <Text style={styles.buttonText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  item: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  device: { fontWeight: '700', textAlign: 'right' },
  date: { color: '#777', fontSize: 12, textAlign: 'right' },
  button: { backgroundColor: '#E63946', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  buttonText: { color: '#FFF', fontSize: 12 },
});

export default SessionsList;
