import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';
import { markNotificationAsRead, subscribeNotifications } from '../../services/firestoreDemo';

const NotificationsDemoScreen = ({ userId, onBack }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeNotifications({
      userId,
      onData: (data) => {
        setItems(data);
        setIsLoading(false);
      },
      onError: (e) => {
        setError(e?.message || 'تعذر تحميل الإشعارات');
        setIsLoading(false);
      },
    });

    return () => unsubscribe();
  }, [userId]);

  const markRead = async (notificationId) => {
    try {
      await markNotificationAsRead({ notificationId });
      setItems((prev) =>
        prev.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item))
      );
    } catch (e) {
      setError(e?.message || 'فشل تحديث الإشعار');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>‹ العودة للوحة</Text>
      </TouchableOpacity>
      <Text style={styles.title}>الإشعارات</Text>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>لا توجد إشعارات</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => markRead(item.id)} style={[styles.card, item.isRead && styles.readCard]}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
              <Text style={styles.cardMeta}>{item.type} • {item.isRead ? 'مقروء' : 'غير مقروء'}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.md, backgroundColor: COLORS.white },
  back: { color: COLORS.primary, fontWeight: '700', marginBottom: SIZES.sm },
  title: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', marginBottom: SIZES.sm, textAlign: 'right' },
  error: { color: COLORS.danger, textAlign: 'right' },
  empty: { color: COLORS.gray, textAlign: 'center', marginTop: SIZES.md },
  card: { backgroundColor: COLORS.gray, borderRadius: 10, padding: SIZES.sm, marginBottom: SIZES.xs },
  readCard: { opacity: 0.65 },
  cardTitle: { fontWeight: '700', color: COLORS.darkGray, marginBottom: 2 },
  cardBody: { color: COLORS.darkGray },
  cardMeta: { color: COLORS.gray, marginTop: 4, fontSize: FONT_SIZES.sm },
});

export default NotificationsDemoScreen;
