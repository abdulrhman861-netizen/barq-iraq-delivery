import { SECURITY_CHANNELS } from '../constants/security';

const otpStore = {};

const generateOtp = (length = 6) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return `${Math.floor(Math.random() * (max - min + 1)) + min}`;
};

export const sendTwoFactorCode = async ({ userId, channel = SECURITY_CHANNELS.SMS, target }) => {
  if (!userId) throw new Error('userId is required');
  if (!target) throw new Error('target is required');

  const code = generateOtp();
  otpStore[userId] = {
    code,
    channel,
    target,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  return {
    success: true,
    channel,
    expiresInSeconds: 300,
  };
};

export const verifyTwoFactorCode = async ({ userId, code }) => {
  const record = otpStore[userId];
  if (!record) {
    return { success: false, reason: 'missing_code' };
  }

  if (record.expiresAt < Date.now()) {
    delete otpStore[userId];
    return { success: false, reason: 'expired_code' };
  }

  if (`${code}` !== `${record.code}`) {
    return { success: false, reason: 'invalid_code' };
  }

  delete otpStore[userId];
  return { success: true, reason: 'verified' };
};
