import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { messageFromFirestore, messageToFirestore } from '../models/Message';
import { getFirebaseFirestore } from './firebase';

const CHATS_COLLECTION = 'chats';
const buildChatId = (orderId, customerId, driverId) =>
  `${orderId}__${customerId}__${driverId}`.replace(/\//g, '_');

export const getOrCreateOrderChat = async ({ orderId, customerId, driverId }) => {
  if (!orderId || !customerId || !driverId) {
    throw new Error('بيانات المحادثة غير مكتملة');
  }

  const db = getFirebaseFirestore();
  const chatId = buildChatId(orderId, customerId, driverId);
  const chatRef = doc(db, CHATS_COLLECTION, chatId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(chatRef);
    if (!snapshot.exists()) {
      transaction.set(chatRef, {
        orderId,
        customerId,
        driverId,
        lastMessage: '',
        lastMessageAt: null,
      });
    }
  });

  const chatSnapshot = await getDoc(chatRef);
  return {
    id: chatSnapshot.id,
    ...(chatSnapshot.data() || {
      orderId,
      customerId,
      driverId,
      lastMessage: '',
      lastMessageAt: null,
    }),
  };
};

export const streamChatMessages = (chatId, onMessages, onError) => {
  const db = getFirebaseFirestore();
  const messagesRef = collection(db, CHATS_COLLECTION, chatId, 'messages');
  const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messages = snapshot.docs.map((docSnapshot) =>
        messageFromFirestore(docSnapshot)
      );
      onMessages(messages);
    },
    onError
  );
};

export const sendTextMessage = async ({ chatId, senderId, text }) => {
  const trimmedText = (text || '').trim();
  if (!chatId || !senderId || !trimmedText) {
    throw new Error('تعذر إرسال الرسالة');
  }

  const db = getFirebaseFirestore();
  const chatRef = doc(db, CHATS_COLLECTION, chatId);
  const messageRef = doc(collection(db, CHATS_COLLECTION, chatId, 'messages'));
  const batch = writeBatch(db);

  batch.set(messageRef, {
    ...messageToFirestore({ senderId, text: trimmedText, type: 'text' }),
    createdAt: serverTimestamp(),
  });
  batch.set(
    chatRef,
    {
      lastMessage: trimmedText,
      lastMessageAt: serverTimestamp(),
    },
    { merge: true }
  );

  await batch.commit();
};
