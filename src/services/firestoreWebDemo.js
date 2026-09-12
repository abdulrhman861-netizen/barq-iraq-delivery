import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../constants/firebase';

let firestoreInstance = null;

const FIREBASE_REQUIRED_FIELDS = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const isPlaceholder = (value = '') => {
  const normalized = String(value).toLowerCase();
  return (
    !normalized ||
    normalized.includes('your_') ||
    normalized.includes('yourproject') ||
    normalized.includes('example')
  );
};

const normalizeTimestamp = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  return null;
};

const mapDoc = (snapshot) => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: normalizeTimestamp(data.createdAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
    lastMessageAt: normalizeTimestamp(data.lastMessageAt),
  };
};

export const getFirebaseSetupState = () => {
  const missingFields = FIREBASE_REQUIRED_FIELDS.filter((field) => !FIREBASE_CONFIG[field]);
  const hasPlaceholderValues = FIREBASE_REQUIRED_FIELDS.some((field) => isPlaceholder(FIREBASE_CONFIG[field]));

  return {
    isConfigured: missingFields.length === 0 && !hasPlaceholderValues,
    missingFields,
    hasPlaceholderValues,
  };
};

const getFirestoreInstance = () => {
  if (firestoreInstance) return firestoreInstance;

  const { isConfigured } = getFirebaseSetupState();
  if (!isConfigured) return null;

  const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
  firestoreInstance = getFirestore(app);
  return firestoreInstance;
};

export const subscribeUserProfile = (uid, onData, onError) => {
  const db = getFirestoreInstance();
  if (!db || !uid) {
    onData(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      onData(snapshot.exists() ? mapDoc(snapshot) : null);
    },
    onError
  );
};

export const upsertUserRole = async ({ uid, displayName, role, walletId }) => {
  const db = getFirestoreInstance();
  if (!db) return;

  const userRef = doc(db, 'users', uid);
  await setDoc(
    userRef,
    {
      displayName,
      role,
      ...(walletId ? { walletId } : {}),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const subscribeChatsForUser = (uid, onData, onError) => {
  const db = getFirestoreInstance();
  if (!db || !uid) {
    onData([]);
    return () => {};
  }

  let customerChats = [];
  let driverChats = [];

  const emitMerged = () => {
    const mergedMap = new Map();
    [...customerChats, ...driverChats].forEach((chat) => mergedMap.set(chat.id, chat));

    const chats = Array.from(mergedMap.values()).sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });

    onData(chats);
  };

  const unsubCustomer = onSnapshot(
    query(collection(db, 'chats'), where('customerId', '==', uid), orderBy('lastMessageAt', 'desc')),
    (snapshot) => {
      customerChats = snapshot.docs.map(mapDoc);
      emitMerged();
    },
    onError
  );

  const unsubDriver = onSnapshot(
    query(collection(db, 'chats'), where('driverId', '==', uid), orderBy('lastMessageAt', 'desc')),
    (snapshot) => {
      driverChats = snapshot.docs.map(mapDoc);
      emitMerged();
    },
    onError
  );

  return () => {
    unsubCustomer();
    unsubDriver();
  };
};

export const subscribeChatMessages = (chatId, onData, onError) => {
  const db = getFirestoreInstance();
  if (!db || !chatId) {
    onData([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc')),
    (snapshot) => onData(snapshot.docs.map(mapDoc)),
    onError
  );
};

export const sendChatMessage = async ({
  chatId,
  orderId,
  customerId,
  driverId,
  senderId,
  text,
  type = 'text',
}) => {
  const db = getFirestoreInstance();
  if (!db) return;

  const resolvedChatId = chatId || `${orderId || 'chat'}_${customerId}_${driverId}`;
  const chatRef = doc(db, 'chats', resolvedChatId);

  await addDoc(collection(chatRef, 'messages'), {
    senderId,
    text,
    createdAt: serverTimestamp(),
    type,
  });

  await setDoc(
    chatRef,
    {
      orderId: orderId || null,
      customerId,
      driverId,
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
    },
    { merge: true }
  );

  return resolvedChatId;
};

export const createRating = async (payload) => {
  const db = getFirestoreInstance();
  if (!db) return;

  await addDoc(collection(db, 'ratings'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

export const subscribeRecentRatings = (onData, onError) => {
  const db = getFirestoreInstance();
  if (!db) {
    onData([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, 'ratings'), orderBy('createdAt', 'desc'), limit(15)),
    (snapshot) => onData(snapshot.docs.map(mapDoc)),
    onError
  );
};

export const createOrder = async (payload) => {
  const db = getFirestoreInstance();
  if (!db) return;

  await addDoc(collection(db, 'orders'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

export const createNotification = async (payload) => {
  const db = getFirestoreInstance();
  if (!db) return;

  await addDoc(collection(db, 'notifications'), {
    ...payload,
    isRead: false,
    createdAt: serverTimestamp(),
  });
};

export const subscribeNotifications = (uid, onData, onError) => {
  const db = getFirestoreInstance();
  if (!db || !uid) {
    onData([]);
    return () => {};
  }

  return onSnapshot(
    query(
      collection(db, 'notifications'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(25)
    ),
    (snapshot) => onData(snapshot.docs.map(mapDoc)),
    onError
  );
};

export const markNotificationAsRead = async (notificationId) => {
  const db = getFirestoreInstance();
  if (!db) return;

  await updateDoc(doc(db, 'notifications', notificationId), {
    isRead: true,
  });
};

export const ensureWallet = async ({ ownerUserId, ownerRole }) => {
  const db = getFirestoreInstance();
  if (!db) return null;

  const walletsQuery = query(collection(db, 'wallets'), where('ownerUserId', '==', ownerUserId), limit(1));
  const walletsSnapshot = await getDocs(walletsQuery);

  if (!walletsSnapshot.empty) {
    return walletsSnapshot.docs[0].id;
  }

  const newWalletRef = doc(collection(db, 'wallets'));
  await setDoc(newWalletRef, {
    ownerUserId,
    ownerRole,
    currency: 'IQD',
    balance: 0,
    updatedAt: serverTimestamp(),
  });

  return newWalletRef.id;
};

export const subscribeWallet = (walletId, onData, onError) => {
  const db = getFirestoreInstance();
  if (!db || !walletId) {
    onData(null);
    return () => {};
  }

  return onSnapshot(doc(db, 'wallets', walletId), (snapshot) => {
    onData(snapshot.exists() ? mapDoc(snapshot) : null);
  }, onError);
};

export const subscribeWalletTransactions = (walletId, onData, onError) => {
  const db = getFirestoreInstance();
  if (!db || !walletId) {
    onData([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, 'wallets', walletId, 'transactions'), orderBy('createdAt', 'desc'), limit(30)),
    (snapshot) => onData(snapshot.docs.map(mapDoc)),
    onError
  );
};

export const addWalletTransaction = async ({
  walletId,
  type,
  amount,
  description,
  relatedOrderId,
  createdBy,
}) => {
  const db = getFirestoreInstance();
  if (!db) return;

  const walletRef = doc(db, 'wallets', walletId);
  const txRef = doc(collection(db, 'wallets', walletId, 'transactions'));

  await runTransaction(db, async (transaction) => {
    const walletSnapshot = await transaction.get(walletRef);
    if (!walletSnapshot.exists()) {
      throw new Error('المحفظة غير موجودة');
    }

    const walletData = walletSnapshot.data();
    const currentBalance = Number(walletData.balance || 0);
    const txAmount = Number(amount);
    const nextBalance = type === 'debit' ? currentBalance - txAmount : currentBalance + txAmount;

    if (nextBalance < 0) {
      throw new Error('الرصيد غير كافٍ');
    }

    transaction.update(walletRef, {
      balance: nextBalance,
      updatedAt: serverTimestamp(),
    });

    transaction.set(txRef, {
      type,
      amount: txAmount,
      description: description || '',
      relatedOrderId: relatedOrderId || null,
      createdAt: serverTimestamp(),
      createdBy,
    });
  });
};

export const subscribeAllWallets = (onData, onError) => {
  const db = getFirestoreInstance();
  if (!db) {
    onData([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, 'wallets'), orderBy('updatedAt', 'desc'), limit(30)),
    (snapshot) => onData(snapshot.docs.map(mapDoc)),
    onError
  );
};
