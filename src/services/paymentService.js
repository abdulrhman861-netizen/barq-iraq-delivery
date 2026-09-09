import { FIREBASE_PATHS } from '../constants/firebase';
import { readData, writeData, updateData } from './firebase';

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

const now = () => new Date().toISOString();

export const getOrderPayment = (orderId) => readData(`${FIREBASE_PATHS.PAYMENTS}/${orderId}`);

export const getUserTransactions = async (userId) => {
  const data = (await readData(FIREBASE_PATHS.TRANSACTIONS)) || {};
  return Object.keys(data)
    .map((id) => ({ id, ...data[id] }))
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const processOrderPayment = async ({ order, userId, method = 'cash', amount }) => {
  if (!order?.id) throw new Error('Order id is required');

  const paymentAmount = Number(amount ?? order.totalAmount ?? order.itemPrice ?? 0);
  const status = paymentAmount > 0 ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED;
  const timestamp = now();
  const transactionId = `${Date.now()}`;

  const paymentRecord = {
    orderId: order.id,
    userId,
    method,
    amount: paymentAmount,
    status,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await writeData(`${FIREBASE_PATHS.PAYMENTS}/${order.id}`, paymentRecord);

  const transaction = {
    ...paymentRecord,
    type: 'order_payment',
  };

  await writeData(`${FIREBASE_PATHS.TRANSACTIONS}/${transactionId}`, transaction);

  await updateData(`${FIREBASE_PATHS.ORDERS}/${order.id}`, {
    paymentStatus: status,
    isPaid: status === PAYMENT_STATUS.SUCCESS,
    paidAt: status === PAYMENT_STATUS.SUCCESS ? timestamp : null,
    allowRating: status === PAYMENT_STATUS.SUCCESS,
    updatedAt: timestamp,
  });

  return {
    payment: paymentRecord,
    transaction: {
      id: transactionId,
      ...transaction,
    },
  };
};
