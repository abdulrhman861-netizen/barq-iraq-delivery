import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../constants';
import {
  getOrCreateOrderChat,
  sendTextMessage,
  streamChatMessages,
} from '../services/chatService';

const ChatScreen = ({
  onBack,
  orderId,
  customerId,
  driverId,
  currentUserId,
  title,
}) => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const activeUserId = useMemo(
    () => currentUserId || customerId,
    [currentUserId, customerId]
  );

  useEffect(() => {
    let isMounted = true;
    let unsubscribe;

    const initializeChat = async () => {
      setIsLoading(true);
      setLoadError(null);
      setMessages([]);
      try {
        const chat = await getOrCreateOrderChat({ orderId, customerId, driverId });
        if (!isMounted) return;

        setChatId(chat.id);
        unsubscribe = streamChatMessages(
          chat.id,
          (nextMessages) => {
            if (!isMounted) return;
            setMessages(nextMessages);
            setIsLoading(false);
          },
          () => {
            if (!isMounted) return;
            setLoadError('تعذر تحميل الرسائل، حاول مرة أخرى');
            setMessages([]);
            setIsLoading(false);
          }
        );
      } catch (e) {
        if (!isMounted) return;
        setLoadError('تعذر تهيئة المحادثة');
        setMessages([]);
        setIsLoading(false);
      }
    };

    initializeChat();
    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [orderId, customerId, driverId, retryKey]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || !activeUserId || !chatId || isSending) return;

    setIsSending(true);
    try {
      await sendTextMessage({ chatId, senderId: activeUserId, text });
      setInputValue('');
      setSendError(null);
    } catch (e) {
      setSendError('فشل إرسال الرسالة، حاول مرة أخرى');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return '';
    const date = typeof createdAt.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }) => {
    const isOwn = item.senderId === activeUserId;
    return (
      <View style={[styles.messageRow, isOwn ? styles.ownRow : styles.otherRow]}>
        <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>{item.text}</Text>
          <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    );
  };

  const headerTitle = title || (orderId ? `دردشة الطلب ${orderId}` : 'الدردشة');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : loadError ? (
        <View style={styles.centerState}>
          <Text style={styles.stateText}>{loadError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setRetryKey((prev) => prev + 1)}
          >
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.chatArea}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.centerState}>
                <Text style={styles.stateText}>لا توجد رسائل بعد</Text>
              </View>
            }
          />
          {!!sendError && <Text style={styles.sendErrorText}>{sendError}</Text>}
          <View style={styles.inputRow}>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              style={styles.input}
              placeholder="اكتب رسالة..."
              placeholderTextColor={COLORS.border}
              multiline
              textAlign="right"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputValue.trim() || isSending) && styles.sendButtonDisabled,
              ]}
              disabled={!inputValue.trim() || isSending}
              onPress={handleSend}
            >
              <Text style={styles.sendButtonText}>{isSending ? '...' : 'إرسال'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'right',
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  chatArea: {
    flex: 1,
  },
  listContent: {
    padding: SIZES.md,
    flexGrow: 1,
  },
  messageRow: {
    marginBottom: SIZES.sm,
  },
  ownRow: {
    alignItems: 'flex-end',
  },
  otherRow: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
  },
  otherBubble: {
    backgroundColor: COLORS.gray,
  },
  messageText: {
    color: COLORS.darkGray,
    fontSize: FONT_SIZES.base,
  },
  ownMessageText: {
    color: COLORS.white,
  },
  timeText: {
    marginTop: SIZES.xs,
    fontSize: FONT_SIZES.xs,
    color: COLORS.border,
    textAlign: 'right',
  },
  inputRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    padding: SIZES.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SIZES.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    color: COLORS.darkGray,
    fontSize: FONT_SIZES.base,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 70,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.md,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.base,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.md,
  },
  stateText: {
    color: COLORS.darkGray,
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  sendErrorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.sm,
    textAlign: 'right',
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.xs,
  },
});

export default ChatScreen;
