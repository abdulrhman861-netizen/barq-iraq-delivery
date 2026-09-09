import { createOTP, verifyOTP } from './otpService';

export const startTwoFactorChallenge = ({ userId, method, target }) => {
  if (!userId || !method || !target) {
    throw new Error('بيانات 2FA غير مكتملة');
  }

  return createOTP(`${userId}:${target}`, method);
};

export const verifyTwoFactorChallenge = ({ userId, target, code }) => verifyOTP(`${userId}:${target}`, code);
