import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';

const roles = ['merchant', 'captain', 'employee', 'admin'];

const WebDemoLoginScreen = ({ onLogin }) => {
  const [uid, setUid] = useState('demo-user-1');
  const [displayName, setDisplayName] = useState('مستخدم تجريبي');
  const [role, setRole] = useState('merchant');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تجربة نسخة الويب</Text>
      <Text style={styles.subtitle}>أنشئ/ادخل مستخدم للتجربة ثم ابدأ</Text>

      <TextInput
        style={styles.input}
        value={uid}
        onChangeText={setUid}
        placeholder="معرّف المستخدم uid"
        placeholderTextColor={COLORS.border}
      />
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="الاسم"
        placeholderTextColor={COLORS.border}
      />

      <View style={styles.rolesRow}>
        {roles.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setRole(item)}
            style={[styles.roleButton, role === item && styles.roleButtonActive]}
          >
            <Text style={[styles.roleText, role === item && styles.roleTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => onLogin({ uid: uid.trim(), displayName: displayName.trim(), role })}
      >
        <Text style={styles.loginText}>بدء التجربة</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: SIZES.md, backgroundColor: COLORS.gray },
  title: { fontSize: FONT_SIZES.xxxl, fontWeight: 'bold', textAlign: 'center', color: COLORS.darkGray, marginBottom: SIZES.sm },
  subtitle: { fontSize: FONT_SIZES.base, textAlign: 'center', color: COLORS.gray, marginBottom: SIZES.md },
  input: { backgroundColor: COLORS.white, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, padding: SIZES.sm, marginBottom: SIZES.sm },
  rolesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.sm, marginBottom: SIZES.md },
  roleButton: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingVertical: SIZES.sm, paddingHorizontal: SIZES.md, backgroundColor: COLORS.white },
  roleButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  roleText: { color: COLORS.darkGray, fontWeight: '600' },
  roleTextActive: { color: COLORS.white },
  loginButton: { backgroundColor: COLORS.secondary, borderRadius: 10, padding: SIZES.md, alignItems: 'center' },
  loginText: { color: COLORS.white, fontWeight: '700' },
});

export default WebDemoLoginScreen;
