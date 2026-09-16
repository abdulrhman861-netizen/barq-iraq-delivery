import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../constants/firebase';
import { getFirebaseSetupState } from './firestoreWebDemo';

export const ORDER_STATUSES = {
  NEW: 'new',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  WALLET: 'wallet',
  CARD: 'card',
};

export const ORDER_STATUS_LABELS_AR = {
  [ORDER_STATUSES.NEW]: 'جديد',
  [ORDER_STATUSES.PENDING]: 'قيد الانتظار',
  [ORDER_STATUSES.ACCEPTED]: 'مقبول',
  [ORDER_STATUSES.PICKED_UP]: 'تم الاستلام',
  [ORDER_STATUSES.IN_TRANSIT]: 'قيد التوصيل',
  [ORDER_STATUSES.DELIVERED]: 'تم التسليم',
  [ORDER_STATUSES.CANCELLED]: 'ملغي',
};

const VALID_STATUS_TRANSITIONS = {
  [ORDER_STATUSES.NEW]: [ORDER_STATUSES.ACCEPTED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PENDING]: [ORDER_STATUSES.ACCEPTED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.ACCEPTED]: [ORDER_STATUSES.PICKED_UP, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PICKED_UP]: [ORDER_STATUSES.IN_TRANSIT, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.IN_TRANSIT]: [ORDER_STATUSES.DELIVERED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.DELIVERED]: [],
  [ORDER_STATUSES.CANCELLED]: [],
};

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

const normalizeLocation = (location) => {
  if (!location || typeof location !== 'object') return null;

  const lat = Number(location.lat);
  const lng = Number(location.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
};

const mapStatusHistory = (history = []) => {
  if (!Array.isArray(history)) return [];

  return history.map((entry) => ({
    ...entry,
    at: normalizeTimestamp(entry?.at) || entry?.at || null,
  }));
};

const mapOrderDoc = (snapshot) => {
  const data = snapshot.data() || {};

  return {
    id: snapshot.id,
    ...data,
    createdAt: normalizeTimestamp(data.createdAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
    pickup: {
      ...(data.pickup || {}),
      address: data.pickup?.address || '',
      location: normalizeLocation(data.pickup?.location),
    },
    delivery: {
      ...(data.delivery || {}),
      address: data.delivery?.address || '',
      location: normalizeLocation(data.delivery?.location),
    },
    statusHistory: mapStatusHistory(data.statusHistory),
    participantIds: Array.isArray(data.participantIds) ? data.participantIds : [],
  };
};

const sortByCreatedAtDesc = (orders) =>
  [...orders].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

const getFirestoreInstance = () => {
  const missingFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'].filter(
    (field) => !FIREBASE_CONFIG[field]
  );
  const hasPlaceholderValues = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'].some(
    (field) => isPlaceholder(FIREBASE_CONFIG[field])
  );

  if (missingFields.length > 0 || hasPlaceholderValues) return null;

  const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
  return getFirestore(app);
};

const assertConfigured = () => {
  const setup = getFirebaseSetupState();
  if (!setup.isConfigured) {
    throw new Error('إعداد Firebase غير مكتمل. أضف قيم FIREBASE_* الحقيقية في ملف البيئة.');
  }
};

export const getArabicOrderStatus = (status) => ORDER_STATUS_LABELS_AR[status] || status || 'غير معروف';

export const getAllowedNextStatuses = (status) => VALID_STATUS_TRANSITIONS[status] || [];

export const isValidStatusTransition = (fromStatus, toStatus) => {
  if (fromStatus === toStatus) return false;
  const allowed = getAllowedNextStatuses(fromStatus);
  return allowed.includes(toStatus);
};

const validateCreateOrderInput = (payload) => {
  if (!payload.createdBy) throw new Error('المستخدم غير معروف. الرجاء تسجيل الدخول من جديد.');
  if (!payload.customerId) throw new Error('معرف العميل مطلوب.');
  if (!payload.merchantId) throw new Error('معرف التاجر مطلوب.');
  if (!payload.pickupAddress) throw new Error('عنوان الاستلام مطلوب.');
  if (!payload.deliveryAddress) throw new Error('عنوان التسليم مطلوب.');
  if (!payload.paymentMethod) throw new Error('طريقة الدفع مطلوبة.');
  if (!Object.values(PAYMENT_METHODS).includes(payload.paymentMethod)) {
    throw new Error('طريقة الدفع غير مدعومة.');
  }

  const fee = Number(payload.feeIqd);
  if (!Number.isFinite(fee) || fee <= 0) {
    throw new Error('الرسوم يجب أن تكون رقمًا أكبر من صفر.');
  }
};

export const createOrder = async ({
  currentUser,
  customerId,
  merchantId,
  pickupAddress,
  pickupLocation,
  deliveryAddress,
  deliveryLocation,
  notes,
  feeIqd,
  paymentMethod,
}) => {
  assertConfigured();

  const db = getFirestoreInstance();
  if (!db) throw new Error('تعذر الاتصال بقاعدة البيانات.');

  const createdBy = currentUser?.uid;
  const resolvedCustomerId = (customerId || currentUser?.uid || '').trim();
  const resolvedMerchantId = (
    merchantId ||
    (currentUser?.role === 'merchant' ? currentUser?.uid : '')
  ).trim();

  const payload = {
    createdBy,
    customerId: resolvedCustomerId,
    merchantId: resolvedMerchantId,
    pickupAddress: pickupAddress?.trim(),
    deliveryAddress: deliveryAddress?.trim(),
    paymentMethod: paymentMethod?.trim(),
    feeIqd: Number(feeIqd),
  };

  validateCreateOrderInput(payload);

  const nowIso = new Date().toISOString();
  const participantIds = Array.from(
    new Set([createdBy, resolvedCustomerId, resolvedMerchantId].filter(Boolean))
  );

  const createdRef = await addDoc(collection(db, 'orders'), {
    createdBy,
    customerId: resolvedCustomerId,
    merchantId: resolvedMerchantId,
    assignedCaptainId: null,
    pickup: {
      address: payload.pickupAddress,
      location: normalizeLocation(pickupLocation),
    },
    delivery: {
      address: payload.deliveryAddress,
      location: normalizeLocation(deliveryLocation),
    },
    notes: notes?.trim() || '',
    feeIqd: payload.feeIqd,
    paymentMethod: payload.paymentMethod,
    status: ORDER_STATUSES.PENDING,
    participantIds,
    statusHistory: [
      {
        status: ORDER_STATUSES.PENDING,
        by: createdBy,
        note: 'تم إنشاء الطلب',
        at: nowIso,
      },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return createdRef.id;
};

export const subscribeOrdersForUser = (uid, onData, onError) => {
  const db = getFirestoreInstance();
  if (!db || !uid) {
    onData([]);
    return () => {};
  }

  const ordersQuery = query(collection(db, 'orders'), where('participantIds', 'array-contains', uid));

  return onSnapshot(
    ordersQuery,
    (snapshot) => onData(sortByCreatedAtDesc(snapshot.docs.map(mapOrderDoc))),
    onError
  );
};

export const subscribePendingOrders = (onData, onError) => {
  const db = getFirestoreInstance();
  if (!db) {
    onData([]);
    return () => {};
  }

  const pendingQuery = query(collection(db, 'orders'), where('status', '==', ORDER_STATUSES.PENDING));

  return onSnapshot(
    pendingQuery,
    (snapshot) => onData(sortByCreatedAtDesc(snapshot.docs.map(mapOrderDoc))),
    onError
  );
};

export const getOrderById = async (orderId, actor) => {
  assertConfigured();

  const db = getFirestoreInstance();
  if (!db) throw new Error('تعذر الاتصال بقاعدة البيانات.');
  if (!orderId?.trim()) throw new Error('معرف الطلب مطلوب.');
  if (!actor?.uid) throw new Error('المستخدم غير معروف. الرجاء تسجيل الدخول من جديد.');

  const snapshot = await getDoc(doc(db, 'orders', orderId.trim()));
  if (!snapshot.exists()) return null;

  const order = mapOrderDoc(snapshot);
  const actorId = actor.uid;
  const isAdmin = actor.role === 'admin';
  const isParticipant =
    order.createdBy === actorId ||
    order.customerId === actorId ||
    order.merchantId === actorId ||
    order.assignedCaptainId === actorId ||
    (Array.isArray(order.participantIds) && order.participantIds.includes(actorId));

  if (!isAdmin && !isParticipant) {
    throw new Error('ليس لديك صلاحية عرض هذا الطلب.');
  }

  return order;
};

export const updateOrderStatus = async ({ orderId, nextStatus, actor, note = '' }) => {
  assertConfigured();

  const db = getFirestoreInstance();
  if (!db) throw new Error('تعذر الاتصال بقاعدة البيانات.');

  const actorId = actor?.uid;
  if (!actorId) throw new Error('المستخدم غير معروف. الرجاء تسجيل الدخول من جديد.');
  if (!orderId?.trim()) throw new Error('معرف الطلب مطلوب.');

  const cleanStatus = nextStatus?.trim();
  if (!cleanStatus || !ORDER_STATUS_LABELS_AR[cleanStatus]) {
    throw new Error('حالة الطلب غير مدعومة.');
  }

  const orderRef = doc(db, 'orders', orderId.trim());

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(orderRef);
    if (!snapshot.exists()) {
      throw new Error('الطلب غير موجود.');
    }

    const order = snapshot.data() || {};
    const currentStatus = order.status || ORDER_STATUSES.PENDING;

    if (!isValidStatusTransition(currentStatus, cleanStatus)) {
      throw new Error(
        `لا يمكن تغيير الحالة من ${getArabicOrderStatus(currentStatus)} إلى ${getArabicOrderStatus(cleanStatus)}.`
      );
    }

    const storedParticipantIds = new Set(Array.isArray(order.participantIds) ? order.participantIds : []);

    const isAdmin = actor?.role === 'admin';
    const isCaptain = actor?.role === 'captain';
    const isParticipant =
      storedParticipantIds.has(actorId) ||
      order.createdBy === actorId ||
      order.customerId === actorId ||
      order.merchantId === actorId ||
      order.assignedCaptainId === actorId;

    if (!isParticipant && !isAdmin) {
      throw new Error('ليس لديك صلاحية تعديل هذا الطلب.');
    }

    if (cleanStatus === ORDER_STATUSES.ACCEPTED) {
      if (!isCaptain && !isAdmin) {
        throw new Error('قبول الطلب متاح للكابتن فقط.');
      }

      if (order.assignedCaptainId && order.assignedCaptainId !== actorId) {
        throw new Error('تم قبول الطلب من كابتن آخر.');
      }
    }

    if ([ORDER_STATUSES.PICKED_UP, ORDER_STATUSES.IN_TRANSIT, ORDER_STATUSES.DELIVERED].includes(cleanStatus)) {
      if (!isAdmin && order.assignedCaptainId !== actorId) {
        throw new Error('تحديث هذه الحالة متاح للكابتن المعيّن فقط.');
      }
    }

    if (cleanStatus === ORDER_STATUSES.CANCELLED) {
      const canCancel =
        isAdmin ||
        order.createdBy === actorId ||
        order.merchantId === actorId ||
        order.assignedCaptainId === actorId;

      if (!canCancel) {
        throw new Error('إلغاء الطلب متاح لمنشئ الطلب أو التاجر أو الكابتن المعيّن أو الإدارة فقط.');
      }
    }

    if (
      !isAdmin &&
      ![
        ORDER_STATUSES.ACCEPTED,
        ORDER_STATUSES.PICKED_UP,
        ORDER_STATUSES.IN_TRANSIT,
        ORDER_STATUSES.DELIVERED,
        ORDER_STATUSES.CANCELLED,
      ].includes(cleanStatus)
    ) {
      throw new Error('لا تملك صلاحية تحديث هذه الحالة.');
    }

    const nowIso = new Date().toISOString();
    const nextHistory = [
      ...(Array.isArray(order.statusHistory) ? order.statusHistory : []),
      {
        status: cleanStatus,
        by: actorId,
        note: note?.trim() || '',
        at: nowIso,
      },
    ];

    const updates = {
      status: cleanStatus,
      updatedAt: serverTimestamp(),
      participantIds: Array.from(participantIds),
      statusHistory: nextHistory,
    };

    if (cleanStatus === ORDER_STATUSES.ACCEPTED && !order.assignedCaptainId) {
      updates.assignedCaptainId = actorId;
    }

    transaction.update(orderRef, updates);
  });
};
    const participantIds = new Set(storedParticipantIds);
    participantIds.add(actorId);
