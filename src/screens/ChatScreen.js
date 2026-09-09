// شاشة الدردشة الرئيسية
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ChatContext } from '../../contexts/ChatContext';
import { AuthContext } from '../../contexts/AuthContext';
import ChatHeader from '../../components/ChatHeader';
import ChatBubble from '../../components/ChatBubble';
import MessageInput from '../../components/MessageInput';
import TypingIndicator from '../../components/TypingIndicator';
import { COLORS, SIZES } from '../../constants/index';

const ChatScreen = ({ route, navigation }) => {
  const { otherUserId, otherUserName, otherUserOnline } = route.params || {};
  const { user } = useContext(AuthContext);
  const {
    messages,
    isLoading,
    sendNewMessage,
    listenToMessages,
    markAllAsRead,
    typingUsers,
    setTypingStatus,
  } = useContext(ChatContext);

  const [unsubscribe, setUnsubscribe] = useState(null);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(otherUserOnline);

  useEffect(() => {
    if (user && otherUserId) {
      // بدء الاستماع على الرسالل
      const unsubscribeFn = listenToMessages(user.id, otherUserId);
      setUnsubscribe(unsubscribeFn);

      // تحديث علامة رسالل مقروءة
      markAllAsRead(`${[user.id, otherUserId].sort().join('_')}`);

      return () => {
        if (unsubscribeFn) unsubscribeFn();
      };
    }
  }, [user, otherUserId, listenToMessages, markAllAsRead]);

  const handleSendMessage = async (text) => {
    if (!user || !otherUserId) return;

    try {
      // إيقاف مؤشر الكتابة
      setTypingStatus(user.id, user.name, false);

      await sendNewMessage(user.id, otherUserId, {
        text,
        senderName: user.name,
        type: 'text',
      });
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

  const handleTyping = (isTyping) => {
    if (user) {
      setTypingStatus(user.id, user.name, isTyping);
    }
  };

  const handleDeleteMessage = (messageId) => {
    // يمكن تطبيق حذف الرسالة لاحقاً
    console.log('Delete message:', messageId);
  };

  const renderMessage = ({ item }) => (
    <ChatBubble
      message={item}
      isOwnMessage={item.senderId === user?.id}
      onLongPress={handleDeleteMessage}
    />
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader
        contactName={otherUserName || 'مستخدم'}
        isOnline={isOtherUserOnline}
        lastSeen={new Date().toISOString()}
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<TypingIndicator typingUsers={typingUsers} />}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : null
          }
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    paddingVertical: SIZES.md,
  },
});

export default ChatScreen;
