import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { messageFromFirestore, messageToFirestore } from '../models/Message';
import { getFirebaseFirestore } from './firebase';

const CHATS_COLLECTION = 'chats';

export const getOrCreateOrderChat = async ({ orderId, customerId, driverId }) => {
  if (!orderId || !customerId || !driverId) {
    throw new Error('بيانات المحادثة غير مكتملة');
  }

  const db = getFirebaseFirestore();
  const chatsRef = collection(db, CHATS_COLLECTION);
  const chatQuery = query(
    chatsRef,
    where('orderId', '==', orderId),
    where('customerId', '==', customerId),
    where('driverId', '==', driverId),
    limit(1)
  );

  const existingChat = await getDocs(chatQuery);
  if (!existingChat.empty) {
    return { id: existingChat.docs[0].id, ...existingChat.docs[0].data() };
  }

  const createdChatRef = await addDoc(chatsRef, {
    orderId,
    customerId,
    driverId,
    lastMessage: '',
    lastMessageAt: serverTimestamp(),
  });

  return {
    id: createdChatRef.id,
    orderId,
    customerId,
    driverId,
    lastMessage: '',
    lastMessageAt: null,
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
