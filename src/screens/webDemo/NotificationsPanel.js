import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';
import {
  createNotification,
  markNotificationAsRead,
  subscribeNotifications,
} from '../../services/firestoreWebDemo';

const NotificationsPanel = ({ currentUser, setupState }) => {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('Demo Notification');
  const [body, setBody] = useState('This is a web demo notification');
  const [type, setType] = useState('system');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!setupState.isConfigured) {
      setLoading(false);
      return undefined;
    }

    return subscribeNotifications(
      currentUser.uid,
      (next) => {
        setNotifications(next);
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      }
    );
  }, [currentUser.uid, setupState.isConfigured]);

  const handleCreate = async () => {
    try {
      setSaving(true);
      setError('');
      await createNotification({
        userId: currentUser.uid,
        title: title.trim(),
        body: body.trim(),
        type: type.trim() || 'system',
      });
    } catch (createError) {
      setError(createError.message);
    } finally {
      setSaving(false);
    }
  };

  if (!setupState.isConfigured) {
    return <Text style={styles.placeholder}>Firebase config required for notifications.</Text>;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Notifications</Text>

      <View style={styles.formBox}>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="title" />
        <TextInput style={styles.input} value={body} onChangeText={setBody} placeholder="body" />
        <TextInput style={styles.input} value={type} onChangeText={setType} placeholder="type" />
        <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Create Notification'}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemText}>{item.body}</Text>
              <Text style={styles.itemMeta}>{item.type} | {item.isRead ? 'read' : 'unread'}</Text>
              {!item.isRead && (
                <TouchableOpacity style={styles.readButton} onPress={() => markNotificationAsRead(item.id)}>
                  <Text style={styles.readButtonText}>Mark as read</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, gap: SIZES.sm },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.darkGray },
  formBox: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm, gap: SIZES.sm },
  input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm },
  button: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SIZES.sm, alignItems: 'center' },
  buttonText: { color: COLORS.white, fontWeight: '700' },
  error: { color: COLORS.danger },
  empty: { color: COLORS.gray },
  item: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm, marginBottom: SIZES.sm },
  itemTitle: { color: COLORS.darkGray, fontWeight: '700' },
  itemText: { color: COLORS.darkGray, marginTop: 4 },
  itemMeta: { color: COLORS.gray, marginTop: 4 },
  readButton: { marginTop: 6, alignSelf: 'flex-start', backgroundColor: COLORS.secondary, borderRadius: 6, paddingHorizontal: SIZES.sm, paddingVertical: 6 },
  readButtonText: { color: COLORS.white, fontSize: FONT_SIZES.sm },
  placeholder: { color: COLORS.gray },
});

export default NotificationsPanel;
