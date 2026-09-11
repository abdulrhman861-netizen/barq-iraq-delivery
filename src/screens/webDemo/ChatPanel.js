import React, { useEffect, useMemo, useState } from 'react';
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
  sendChatMessage,
  subscribeChatMessages,
  subscribeChatsForUser,
} from '../../services/firestoreWebDemo';

const ChatPanel = ({ currentUser, setupState }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState('');
  const [otherUserId, setOtherUserId] = useState('demo-captain-user');
  const [orderId, setOrderId] = useState('demo-order-1');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!setupState.isConfigured) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const unsubscribe = subscribeChatsForUser(
      currentUser.uid,
      (nextChats) => {
        setChats(nextChats);
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser.uid, setupState.isConfigured]);

  useEffect(() => {
    if (!setupState.isConfigured || !activeChatId) {
      setMessages([]);
      return undefined;
    }

    return subscribeChatMessages(
      activeChatId,
      (nextMessages) => {
        setMessages(nextMessages);
      },
      (snapshotError) => {
        setError(snapshotError.message);
      }
    );
  }, [activeChatId, setupState.isConfigured]);

  const chatParticipants = useMemo(() => {
    const isCaptain = currentUser.role === 'captain';
    return {
      customerId: isCaptain ? otherUserId : currentUser.uid,
      driverId: isCaptain ? currentUser.uid : otherUserId,
    };
  }, [currentUser.role, currentUser.uid, otherUserId]);

  const handleSend = async () => {
    if (!text.trim() || !otherUserId.trim()) return;

    try {
      setSending(true);
      setError('');
      const chatId = await sendChatMessage({
        chatId: activeChatId || undefined,
        orderId: orderId.trim() || null,
        customerId: chatParticipants.customerId,
        driverId: chatParticipants.driverId,
        senderId: currentUser.uid,
        text: text.trim(),
        type: 'text',
      });

      setActiveChatId(chatId);
      setText('');
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setSending(false);
    }
  };

  if (!setupState.isConfigured) {
    return <Text style={styles.placeholder}>Add Firebase config to enable chat writes/reads.</Text>;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Realtime Chat</Text>
      <View style={styles.formRow}>
        <TextInput value={otherUserId} onChangeText={setOtherUserId} style={styles.input} placeholder="other user id" />
        <TextInput value={orderId} onChangeText={setOrderId} style={styles.input} placeholder="order id" />
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : chats.length === 0 ? (
        <Text style={styles.empty}>No chats yet. Send the first message.</Text>
      ) : (
        <FlatList
          horizontal
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chatItem, activeChatId === item.id && styles.chatItemActive]}
              onPress={() => setActiveChatId(item.id)}
            >
              <Text style={styles.chatItemTitle}>{item.orderId || item.id}</Text>
              <Text numberOfLines={1} style={styles.chatItemSubtitle}>{item.lastMessage || '-'}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.messagesBox}>
        {messages.length === 0 ? (
          <Text style={styles.empty}>No messages</Text>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Text style={styles.messageLine}>
                {item.senderId === currentUser.uid ? 'You' : item.senderId}: {item.text}
              </Text>
            )}
          />
        )}
      </View>

      <View style={styles.formRow}>
        <TextInput value={text} onChangeText={setText} style={styles.input} placeholder="message" />
        <TouchableOpacity disabled={sending || !text.trim()} style={[styles.sendButton, (sending || !text.trim()) && styles.disabled]} onPress={handleSend}>
          <Text style={styles.sendButtonText}>{sending ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { gap: SIZES.sm, flex: 1 },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.darkGray },
  formRow: { flexDirection: 'row', gap: SIZES.sm, alignItems: 'center' },
  input: { flex: 1, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm },
  sendButton: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SIZES.sm, paddingHorizontal: SIZES.md },
  sendButtonText: { color: COLORS.white, fontWeight: '700' },
  disabled: { opacity: 0.5 },
  chatItem: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm, width: 180, marginRight: SIZES.sm },
  chatItemActive: { borderColor: COLORS.primary },
  chatItemTitle: { fontWeight: '700', color: COLORS.darkGray },
  chatItemSubtitle: { color: COLORS.gray, marginTop: 4 },
  messagesBox: { flex: 1, minHeight: 180, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm },
  messageLine: { color: COLORS.darkGray, marginBottom: 6 },
  empty: { color: COLORS.gray },
  error: { color: COLORS.danger },
  placeholder: { color: COLORS.gray },
});

export default ChatPanel;
