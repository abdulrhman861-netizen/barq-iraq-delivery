import { PAYMENT_ERRORS, PAYMENT_STATUS } from '../constants/payment';

const createTransactionId = () => `st_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const chargeStripeCard = async ({ amount, currency = 'IQD', cardToken }) => {
  if (!amount || amount <= 0) {
    throw new Error('قيمة الدفع غير صحيحة');
  }

  if (!cardToken) {
    throw new Error(PAYMENT_ERRORS.INVALID_CARD);
  }

  return {
    id: createTransactionId(),
    amount,
    currency,
    status: PAYMENT_STATUS.COMPLETED,
    provider: 'stripe',
    createdAt: new Date().toISOString(),
  };
};

export const handleStripeError = (error) => ({
  provider: 'stripe',
  status: PAYMENT_STATUS.FAILED,
  message: error?.message || PAYMENT_ERRORS.GATEWAY_ERROR,
});
