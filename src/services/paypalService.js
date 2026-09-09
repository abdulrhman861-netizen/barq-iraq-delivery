import { PAYMENT_STATUS } from '../constants/payment';

const createPayPalTransactionId = () => `pp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const createPayPalPayment = async ({ amount, currency = 'USD', walletId }) => {
  if (!amount || amount <= 0) {
    throw new Error('قيمة الدفع غير صحيحة');
  }

  return {
    id: createPayPalTransactionId(),
    amount,
    currency,
    walletId,
    status: PAYMENT_STATUS.PROCESSING,
    provider: 'paypal',
    createdAt: new Date().toISOString(),
  };
};

export const capturePayPalPayment = async (payment) => ({
  ...payment,
  status: PAYMENT_STATUS.COMPLETED,
  capturedAt: new Date().toISOString(),
});
