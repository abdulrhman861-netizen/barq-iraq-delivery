import { OTP_CONFIG } from '../constants/twoFactorAuth';

const activeOtps = new Map();

const generateOtpCode = () => `${Math.floor(Math.random() * 10 ** OTP_CONFIG.LENGTH)}`.padStart(OTP_CONFIG.LENGTH, '0');

export const createOTP = (target, method) => {
  const code = generateOtpCode();
  const payload = {
    target,
    method,
    code,
    expiresAt: Date.now() + OTP_CONFIG.EXPIRY_SECONDS * 1000,
    attempts: 0,
  };

  activeOtps.set(target, payload);
  return payload;
};

export const verifyOTP = (target, code) => {
  const otp = activeOtps.get(target);
  if (!otp) return { success: false, reason: 'OTP غير موجود' };

  if (Date.now() > otp.expiresAt) {
    activeOtps.delete(target);
    return { success: false, reason: 'انتهت صلاحية OTP' };
  }

  if (otp.code !== String(code)) {
    otp.attempts += 1;
    if (otp.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
      activeOtps.delete(target);
      return { success: false, reason: 'تم تجاوز عدد المحاولات' };
    }

    activeOtps.set(target, otp);
    return { success: false, reason: 'رمز OTP غير صحيح' };
  }

  activeOtps.delete(target);
  return { success: true };
};
