// Hook للتحقق من صحة بيانات الدفع
import { useState, useCallback } from 'react';
import {
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
  validateEmail,
  validateIraqiPhone,
} from '../utils/security';

export const usePaymentValidation = () => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // التحقق من صحة بيانات البطاقة
  const validateCard = useCallback((cardData) => {
    const newErrors = {};

    // التحقق من رقم البطاقة
    if (!cardData.cardNumber) {
      newErrors.cardNumber = 'رقم البطاقة مطلوب';
    } else if (!validateCardNumber(cardData.cardNumber)) {
      newErrors.cardNumber = 'رقم البطاقة غير صحيح';
    }

    // التحقق من CVV
    if (!cardData.cvv) {
      newErrors.cvv = 'رمز CVV مطلوب';
    } else if (!validateCVV(cardData.cvv)) {
      newErrors.cvv = 'رمز CVV غير صحيح (3-4 أرقام)';
    }

    // التحقق من تاريخ الانتهاء
    if (!cardData.expiryDate) {
      newErrors.expiryDate = 'تاريخ الانتهاء مطلوب';
    } else if (!validateExpiryDate(cardData.expiryDate)) {
      newErrors.expiryDate = 'تاريخ الانتهاء غير صحيح أو منتهي';
    }

    // التحقق من اسم صاحب البطاقة
    if (!cardData.cardholderName) {
      newErrors.cardholderName = 'اسم صاحب البطاقة مطلوب';
    } else if (cardData.cardholderName.length < 3) {
      newErrors.cardholderName = 'اسم غير صحيح';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  }, []);

  // التحقق من بيانات شحن المحفظة
  const validateTopUp = useCallback((topUpData) => {
    const newErrors = {};

    // التحقق من المبلغ
    if (!topUpData.amount) {
      newErrors.amount = 'المبلغ مطلوب';
    } else if (topUpData.amount < 1000) {
      newErrors.amount = 'الحد الأدنى للشحن 1,000 دينار';
    } else if (topUpData.amount > 10000000) {
      newErrors.amount = 'الحد الأقصى للشحن 10,000,000 دينار';
    }

    // التحقق من طريقة الدفع
    if (!topUpData.paymentMethod) {
      newErrors.paymentMethod = 'اختر طريقة دفع';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  }, []);

  // التحقق من بيانات التحويل
  const validateTransfer = useCallback((transferData) => {
    const newErrors = {};

    // التحقق من المبلغ
    if (!transferData.amount) {
      newErrors.amount = 'المبلغ مطلوب';
    } else if (transferData.amount < 1000) {
      newErrors.amount = 'الحد الأدنى للتحويل 1,000 دينار';
    }

    // التحقق من رقم الهاتف
    if (!transferData.recipientPhone) {
      newErrors.recipientPhone = 'رقم الهاتف مطلوب';
    } else if (!validateIraqiPhone(transferData.recipientPhone)) {
      newErrors.recipientPhone = 'رقم هاتف عراقي غير صحيح';
    }

    // التحقق من البريد الإلكتروني (اختياري)
    if (transferData.recipientEmail && !validateEmail(transferData.recipientEmail)) {
      newErrors.recipientEmail = 'البريد الإلكتروني غير صحيح';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  }, []);

  // التحقق من بيانات السحب
  const validateWithdrawal = useCallback((withdrawalData) => {
    const newErrors = {};

    // التحقق من المبلغ
    if (!withdrawalData.amount) {
      newErrors.amount = 'المبلغ مطلوب';
    } else if (withdrawalData.amount < 10000) {
      newErrors.amount = 'الحد الأدنى للسحب 10,000 دينار';
    }

    // التحقق من البنك
    if (!withdrawalData.bankName) {
      newErrors.bankName = 'اسم البنك مطلوب';
    }

    // التحقق من رقم الحساب
    if (!withdrawalData.accountNumber) {
      newErrors.accountNumber = 'رقم الحساب مطلوب';
    }

    // التحقق من اسم صاحب الحساب
    if (!withdrawalData.accountHolder) {
      newErrors.accountHolder = 'اسم صاحب الحساب مطلوب';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);

  return {
    errors,
    isValid,
    validateCard,
    validateTopUp,
    validateTransfer,
    validateWithdrawal,
    clearErrors,
  };
};
