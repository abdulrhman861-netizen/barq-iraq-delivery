import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';
import { buildChatId, sendChatMessage, subscribeChatMessages } from '../../services/firestoreDemo';

const ChatDemoScreen = ({ userId, role, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const chatMeta = useMemo(() => ({
    orderId: 'demo-order-1',
    customerId: userId,
    driverId: 'demo-driver-1',
  }), [userId]);

  const chatId = useMemo(() => buildChatId(chatMeta), [chatMeta]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeChatMessages({
      chatId,
      onData: (items) => {
        setMessages(items);
        setIsLoading(false);
      },
      onError: (e) => {
        setError(e?.message || 'تعذر تحميل الرسائل');
        setIsLoading(false);
      },
    });

    return () => unsubscribe();
  }, [chatId]);

  const submit = async () => {
    const body = text.trim();
    if (!body) return;

    try {
      await sendChatMessage({
        chatId,
        ...chatMeta,
        senderId: userId,
        text: body,
      });
      setText('');
    } catch (e) {
      setError(e?.message || 'فشل إرسال الرسالة');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹ العودة للوحة</Text>
      </TouchableOpacity>

      <Text style={styles.title}>الدردشة - {role}</Text>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          inverted
          ListEmptyComponent={<Text style={styles.empty}>لا توجد رسائل بعد</Text>}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.senderId === userId ? styles.ownBubble : styles.otherBubble]}>
              <Text style={styles.bubbleText}>{item.text}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="اكتب رسالتك"
          placeholderTextColor={COLORS.border}
        />
        <TouchableOpacity onPress={submit} style={styles.sendBtn}>
          <Text style={styles.sendText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.md, backgroundColor: COLORS.white },
  backButton: { marginBottom: SIZES.sm },
  backButtonText: { color: COLORS.primary, fontWeight: '700' },
  title: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', marginBottom: SIZES.sm, textAlign: 'right' },
  error: { color: COLORS.danger, textAlign: 'center', marginTop: SIZES.md },
  empty: { color: COLORS.gray, textAlign: 'center', marginTop: SIZES.md },
  bubble: { padding: SIZES.sm, borderRadius: 10, marginVertical: SIZES.xs, maxWidth: '80%' },
  ownBubble: { backgroundColor: COLORS.primary, alignSelf: 'flex-end' },
  otherBubble: { backgroundColor: COLORS.gray, alignSelf: 'flex-start' },
  bubbleText: { color: COLORS.black },
  inputRow: { flexDirection: 'row', gap: SIZES.sm, alignItems: 'center', marginTop: SIZES.sm },
  input: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm },
  sendBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm },
  sendText: { color: COLORS.white, fontWeight: '700' },
});

export default ChatDemoScreen;
