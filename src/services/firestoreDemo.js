import { initializeApp, getApps } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

const readEnv = (key) =>
  process.env?.[key] || process.env?.[`EXPO_PUBLIC_${key}`] || '';

const firebaseConfig = {
  apiKey: readEnv('FIREBASE_API_KEY'),
  authDomain: readEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('FIREBASE_APP_ID'),
};

const isPlaceholder = (value) =>
  !value ||
  value.startsWith('YOUR_') ||
  value.includes('your_project') ||
  value.includes('your_sender_id') ||
  value.includes('your_app_id');

const canUseFirebase =
  firebaseConfig.projectId &&
  Object.values(firebaseConfig).every((value) => !isPlaceholder(value));

let firestore = null;

if (canUseFirebase) {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  firestore = getFirestore(app);
}

const nowIso = () => new Date().toISOString();

const demoDb = {
  chats: {
    'demo-order-1_demo-user-1_demo-driver-1': {
      orderId: 'demo-order-1',
      customerId: 'demo-user-1',
      driverId: 'demo-driver-1',
      lastMessage: 'تم استلام الطلب وسأصل خلال 10 دقائق',
      lastMessageAt: nowIso(),
      messages: [
        {
          id: 'm-1',
          senderId: 'demo-driver-1',
          text: 'تم استلام الطلب وسأصل خلال 10 دقائق',
          createdAt: nowIso(),
          type: 'text',
        },
      ],
    },
  },
  ratings: [],
  orders: [],
  notifications: [
    {
      id: 'n-1',
      userId: 'demo-user-1',
      title: 'مرحباً بك في وضع التجربة',
      body: 'يمكنك تجربة كل الصفحات حتى بدون إعداد Firebase.',
      type: 'system',
      isRead: false,
      createdAt: nowIso(),
    },
  ],
  users: {
    'demo-user-1': {
      displayName: 'مستخدم تجريبي',
      role: 'merchant',
      walletId: 'wallet-demo-user-1',
    },
  },
  wallets: {
    'wallet-demo-user-1': {
      id: 'wallet-demo-user-1',
      ownerUserId: 'demo-user-1',
      ownerRole: 'merchant',
      currency: 'IQD',
      balance: 25000,
      updatedAt: nowIso(),
      transactions: [
        {
          id: 'tx-1',
          type: 'credit',
          amount: 25000,
          description: 'رصيد افتتاحي تجريبي',
          relatedOrderId: null,
          createdAt: nowIso(),
          createdBy: 'system',
        },
      ],
    },
  },
};

const normalizeDate = (value) => {
  if (!value) return nowIso();
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
};

const buildChatId = ({ orderId, customerId, driverId }) =>
  `${orderId}_${customerId}_${driverId}`;

export const firebaseMode = canUseFirebase ? 'firebase' : 'demo';

export const upsertUserProfile = async ({ uid, displayName, role }) => {
  const payload = { updatedAt: nowIso() };
  if (displayName) payload.displayName = displayName;
  if (role) payload.role = role;

  if (!canUseFirebase) {
    demoDb.users[uid] = { ...(demoDb.users[uid] || {}), ...payload };
    return demoDb.users[uid];
  }

  const ref = doc(firestore, 'users', uid);
  await setDoc(ref, payload, { merge: true });
  const snap = await getDoc(ref);
  return snap.data();
};

export const setUserRole = async ({ uid, role }) => {
  return upsertUserProfile({ uid, displayName: 'مستخدم', role });
};

export const subscribeChatMessages = ({ chatId, onData, onError }) => {
  if (!canUseFirebase) {
    const messages = demoDb.chats[chatId]?.messages || [];
    onData(messages);
    return () => {};
  }

  const q = query(
    collection(firestore, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: normalizeDate(d.data().createdAt),
      }));
      onData(items);
    },
    onError
  );
};

export const sendChatMessage = async ({ chatId, orderId, customerId, driverId, senderId, text, type = 'text' }) => {
  const createdAt = nowIso();
  const message = { senderId, text, createdAt, type };

  if (!canUseFirebase) {
    const chat = demoDb.chats[chatId] || {
      orderId,
      customerId,
      driverId,
      messages: [],
    };
    chat.messages = [{ id: `m-${Date.now()}`, ...message }, ...chat.messages];
    chat.lastMessage = text;
    chat.lastMessageAt = createdAt;
    demoDb.chats[chatId] = chat;
    return;
  }

  await setDoc(
    doc(firestore, 'chats', chatId),
    {
      orderId,
      customerId,
      driverId,
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
    },
    { merge: true }
  );

  await addDoc(collection(firestore, 'chats', chatId, 'messages'), {
    ...message,
    createdAt: serverTimestamp(),
  });
};

export const createOrderRecord = async (payload) => {
  const base = {
    ...payload,
    status: 'pending',
    createdAt: nowIso(),
  };

  if (!canUseFirebase) {
    const id = `order-${Date.now()}`;
    demoDb.orders.unshift({ id, ...base });
    return id;
  }

  const docRef = await addDoc(collection(firestore, 'orders'), {
    ...payload,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const submitRatingRecord = async (payload) => {
  const base = { ...payload, createdAt: nowIso() };

  if (!canUseFirebase) {
    demoDb.ratings.unshift({ id: `r-${Date.now()}`, ...base });
    return;
  }

  await addDoc(collection(firestore, 'ratings'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

export const fetchRecentRatings = async (limitCount = 10) => {
  if (!canUseFirebase) {
    return demoDb.ratings.slice(0, limitCount);
  }

  const q = query(collection(firestore, 'ratings'), orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: normalizeDate(d.data().createdAt),
  }));
};

export const subscribeNotifications = ({ userId, onData, onError }) => {
  if (!canUseFirebase) {
    const data = demoDb.notifications
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    onData(data);
    return () => {};
  }

  const q = query(collection(firestore, 'notifications'), where('userId', '==', userId), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: normalizeDate(d.data().createdAt),
      }));
      onData(data);
    },
    onError
  );
};

export const markNotificationAsRead = async ({ notificationId }) => {
  if (!canUseFirebase) {
    demoDb.notifications = demoDb.notifications.map((item) =>
      item.id === notificationId ? { ...item, isRead: true } : item
    );
    return;
  }

  await updateDoc(doc(firestore, 'notifications', notificationId), { isRead: true });
};

const ensureDemoWallet = ({ ownerUserId, ownerRole }) => {
  const existing = Object.values(demoDb.wallets).find((w) => w.ownerUserId === ownerUserId);
  if (existing) return existing;

  const walletId = `wallet-${ownerUserId}`;
  const wallet = {
    id: walletId,
    ownerUserId,
    ownerRole,
    currency: 'IQD',
    balance: 0,
    updatedAt: nowIso(),
    transactions: [],
  };
  demoDb.wallets[walletId] = wallet;
  demoDb.users[ownerUserId] = { ...(demoDb.users[ownerUserId] || {}), walletId };
  return wallet;
};

export const ensureWallet = async ({ ownerUserId, ownerRole }) => {
  if (!canUseFirebase) {
    return ensureDemoWallet({ ownerUserId, ownerRole });
  }

  const q = query(collection(firestore, 'wallets'), where('ownerUserId', '==', ownerUserId), limit(1));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const existing = snapshot.docs[0];
    return { id: existing.id, ...existing.data(), updatedAt: normalizeDate(existing.data().updatedAt) };
  }

  const walletRef = await addDoc(collection(firestore, 'wallets'), {
    ownerUserId,
    ownerRole,
    currency: 'IQD',
    balance: 0,
    updatedAt: serverTimestamp(),
  });
  await setDoc(doc(firestore, 'users', ownerUserId), { walletId: walletRef.id }, { merge: true });

  return {
    id: walletRef.id,
    ownerUserId,
    ownerRole,
    currency: 'IQD',
    balance: 0,
    updatedAt: nowIso(),
  };
};

export const subscribeWallet = ({ walletId, onWallet, onTransactions, onError }) => {
  if (!canUseFirebase) {
    const wallet = demoDb.wallets[walletId];
    onWallet(wallet || null);
    onTransactions((wallet?.transactions || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    return () => {};
  }

  const unsubscribeWallet = onSnapshot(
    doc(firestore, 'wallets', walletId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onWallet(null);
        return;
      }

      const data = snapshot.data();
      onWallet({ id: snapshot.id, ...data, updatedAt: normalizeDate(data.updatedAt) });
    },
    onError
  );

  const txQuery = query(collection(firestore, 'wallets', walletId, 'transactions'), orderBy('createdAt', 'desc'));

  const unsubscribeTransactions = onSnapshot(
    txQuery,
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: normalizeDate(d.data().createdAt),
      }));
      onTransactions(data);
    },
    onError
  );

  return () => {
    unsubscribeWallet();
    unsubscribeTransactions();
  };
};

export const addWalletTransaction = async ({ walletId, type, amount, description, relatedOrderId, createdBy }) => {
  const numericAmount = Number(amount);
  if (!numericAmount || numericAmount <= 0) {
    throw new Error('المبلغ يجب أن يكون أكبر من صفر');
  }

  if (!canUseFirebase) {
    const wallet = demoDb.wallets[walletId];
    if (!wallet) throw new Error('المحفظة غير موجودة');

    const sign = type === 'debit' || type === 'withdrawal' ? -1 : 1;
    const nextBalance = wallet.balance + sign * numericAmount;
    if (nextBalance < 0) {
      throw new Error('الرصيد غير كافٍ');
    }

    wallet.balance = nextBalance;
    wallet.updatedAt = nowIso();
    wallet.transactions.unshift({
      id: `tx-${Date.now()}`,
      type,
      amount: numericAmount,
      description,
      relatedOrderId: relatedOrderId || null,
      createdAt: nowIso(),
      createdBy,
    });
    return;
  }

  const walletRef = doc(firestore, 'wallets', walletId);
  const walletSnap = await getDoc(walletRef);
  if (!walletSnap.exists()) {
    throw new Error('المحفظة غير موجودة');
  }

  const walletData = walletSnap.data();
  const sign = type === 'debit' || type === 'withdrawal' ? -1 : 1;
  const nextBalance = Number(walletData.balance || 0) + sign * numericAmount;

  if (nextBalance < 0) {
    throw new Error('الرصيد غير كافٍ');
  }

  await updateDoc(walletRef, {
    balance: nextBalance,
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(firestore, 'wallets', walletId, 'transactions'), {
    type,
    amount: numericAmount,
    description,
    relatedOrderId: relatedOrderId || null,
    createdAt: serverTimestamp(),
    createdBy,
  });
};

export const listWallets = async () => {
  if (!canUseFirebase) {
    return Object.values(demoDb.wallets).map((wallet) => ({
      id: wallet.id,
      ownerUserId: wallet.ownerUserId,
      ownerRole: wallet.ownerRole,
      currency: wallet.currency,
      balance: wallet.balance,
      updatedAt: wallet.updatedAt,
    }));
  }

  const snapshot = await getDocs(collection(firestore, 'wallets'));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    updatedAt: normalizeDate(d.data().updatedAt),
  }));
};

export { buildChatId };
