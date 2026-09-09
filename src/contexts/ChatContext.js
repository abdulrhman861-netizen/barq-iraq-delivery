// Context لإدارة الدردشة والرسالل
import React, { createContext, useState, useCallback } from 'react';
import {
  sendMessage,
  getMessages,
  listenToData,
  readData,
} from '../services/firebase';
import { FIREBASE_PATHS } from '../constants/firebase';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCount, setUnreadCount] = useState({});

  // الحصول على معرف المحادثة الفريد
  const getChatId = useCallback((userId1, userId2) => {
    return [userId1, userId2].sort().join('_');
  }, []);

  // إرسال رسالة جديدة
  const sendNewMessage = useCallback(
    async (userId1, userId2, messageData) => {
      try {
        setIsLoading(true);
        setError(null);

        const chatId = getChatId(userId1, userId2);
        const message = {
          id: Date.now().toString(),
          senderId: userId1,
          senderName: messageData.senderName,
          text: messageData.text,
          timestamp: new Date().toISOString(),
          isRead: false,
          type: messageData.type || 'text', // text, image, location, etc.
          attachmentUrl: messageData.attachmentUrl || null,
        };

        await sendMessage(userId1, userId2, message);

        // تحديث قائمة الرسالل
        setMessages((prev) => [message, ...prev]);

        // تحديث راية المحادثة
        setConversations((prev) => ({
          ...prev,
          [chatId]: {
            ...prev[chatId],
            lastMessage: message.text,
            lastMessageTime: message.timestamp,
            lastMessageSender: userId1,
          },
        }));

        console.log('✅ Message sent successfully');
        return message;
      } catch (err) {
        const errorMessage = err.message || 'خطأ في إرسال الرسالة';
        setError(errorMessage);
        console.error('❌ Error sending message:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [getChatId]
  );

  // جلب رسالل محاثة معينة
  const fetchMessages = useCallback(async (userId1, userId2) => {
    try {
      setIsLoading(true);
      const chatMessages = await getMessages(userId1, userId2);
      if (chatMessages) {
        const messagesArray = Object.keys(chatMessages)
          .map((key) => ({
            id: key,
            ...chatMessages[key],
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // الاستماع إلى رسالل محاثة بشكل حي
  const listenToMessages = useCallback(
    (userId1, userId2, callback) => {
      const chatId = getChatId(userId1, userId2);
      const unsubscribe = listenToData(
        `${FIREBASE_PATHS.MESSAGES}/${chatId}`,
        (data) => {
          if (data) {
            const messagesArray = Object.keys(data)
              .map((key) => ({
                id: key,
                ...data[key],
              }))
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setMessages(messagesArray);
            if (callback) callback(messagesArray);
          }
        }
      );
      return unsubscribe;
    },
    [getChatId]
  );

  // جلب كافة المحادثات للمستخدم
  const fetchUserConversations = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      const data = await readData(FIREBASE_PATHS.MESSAGES);
      if (data) {
        const userConversations = {};
        Object.keys(data).forEach((chatId) => {
          if (chatId.includes(userId)) {
            userConversations[chatId] = data[chatId];
          }
        });
        setConversations(userConversations);
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching conversations:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // وضع علامة على رسالة كمقروءة
  const markAsRead = useCallback((messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  }, []);

  // مببب مشاهدة الرسالل الجديدة
  const markAllAsRead = useCallback((chatId) => {
    setMessages((prev) =>
      prev.map((msg) => ({ ...msg, isRead: true }))
    );
    setUnreadCount((prev) => ({
      ...prev,
      [chatId]: 0,
    }));
  }, []);

  // عد الرسالل غير المقروءة
  const getUnreadCount = useCallback((chatId) => {
    return unreadCount[chatId] || 0;
  }, [unreadCount]);

  // أيقاف رسالة (Recall)
  const deleteMessage = useCallback((messageId, userId) => {
    setMessages((prev) =>
      prev.filter((msg) => msg.id !== messageId)
    );
  }, []);

  // البحث عن رسالل
  const searchMessages = useCallback((query) => {
    if (!query) return messages;
    return messages.filter(
      (msg) =>
        msg.text.toLowerCase().includes(query.toLowerCase()) ||
        msg.senderName.toLowerCase().includes(query.toLowerCase())
    );
  }, [messages]);

  // إحصائيات الاتصال
  const getChatStats = useCallback(
    (userId1, userId2) => {
      const messagesCount = messages.length;
      const lastMessage = messages[0];
      const firstMessage = messages[messages.length - 1];

      return {
        messagesCount,
        lastMessage: lastMessage ? lastMessage.text : null,
        lastMessageTime: lastMessage ? lastMessage.timestamp : null,
        firstMessageTime: firstMessage ? firstMessage.timestamp : null,
        duration:
          firstMessage && lastMessage
            ? Math.ceil(
                (new Date(lastMessage.timestamp) -
                  new Date(firstMessage.timestamp)) /
                  (1000 * 60 * 60)
              )
            : 0,
      };
    },
    [messages]
  );

  // مؤشر الكتابة
  const setTypingStatus = useCallback((userId, userName, isTyping) => {
    setTypingUsers((prev) =>
      isTyping
        ? { ...prev, [userId]: userName }
        : Object.keys(prev)
            .filter((uid) => uid !== userId)
            .reduce((obj, key) => {
              obj[key] = prev[key];
              return obj;
            }, {})
    );
  }, []);

  const value = {
    // الحالات
    conversations,
    currentChat,
    messages,
    isLoading,
    error,
    typingUsers,
    unreadCount,
    // الدوال
    getChatId,
    sendNewMessage,
    fetchMessages,
    listenToMessages,
    fetchUserConversations,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    deleteMessage,
    searchMessages,
    getChatStats,
    setTypingStatus,
    setCurrentChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
