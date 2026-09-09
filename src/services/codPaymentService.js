import { createPayment, updatePaymentStatus } from './paymentService';
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../constants/payment';

export const createCODPayment = async ({ orderId, customerId, captainId, amount }) => {
  if (!orderId || !customerId || !captainId || !amount) {
    throw new Error('بيانات الدفع عند الاستلام غير مكتملة');
  }

  return createPayment({
    orderId,
    userId: customerId,
    captainId,
    amount,
    method: PAYMENT_METHODS.CASH,
    status: PAYMENT_STATUS.PENDING,
    requiresVerification: true,
    createdAt: new Date().toISOString(),
  });
};

export const confirmCODReceipt = async ({ paymentId, captainSignature, documentPhotoUri, gps, identityVerified }) => {
  if (!paymentId || !captainSignature || !documentPhotoUri || !gps || !identityVerified) {
    throw new Error('يرجى إكمال متطلبات التحقق الأمني');
  }

  await updatePaymentStatus(paymentId, PAYMENT_STATUS.COMPLETED, {
    captainSignature,
    documentPhotoUri,
    gps,
    identityVerified,
    confirmedAt: new Date().toISOString(),
  });

  return { success: true };
};
