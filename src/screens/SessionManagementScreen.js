import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import SessionsList from '../components/SessionsList';
import { createSession, getSessions, logoutSession, logoutAllSessions } from '../services/sessionManagement';

const userId = 'demo-user';

const SessionManagementScreen = () => {
  const [sessions, setSessions] = useState(() => getSessions(userId));

  const addSession = () => {
    createSession({ userId, deviceId: `device-${Date.now()}` });
    setSessions(getSessions(userId));
  };

  const removeSession = (sessionId) => {
    logoutSession({ userId, sessionId });
    setSessions(getSessions(userId));
  };

  const logoutAll = () => {
    logoutAllSessions(userId);
    setSessions(getSessions(userId));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 10, textAlign: 'right' }}>إدارة الجلسات</Text>
      <TouchableOpacity onPress={addSession} style={{ backgroundColor: '#1FBF83', padding: 10, borderRadius: 8, marginBottom: 10 }}>
        <Text style={{ color: '#FFF', textAlign: 'center' }}>إضافة جلسة</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={logoutAll} style={{ backgroundColor: '#E63946', padding: 10, borderRadius: 8, marginBottom: 10 }}>
        <Text style={{ color: '#FFF', textAlign: 'center' }}>تسجيل الخروج من كل الأجهزة</Text>
      </TouchableOpacity>
      <SessionsList sessions={sessions} onLogoutSession={removeSession} />
    </ScrollView>
  );
};

export default SessionManagementScreen;
