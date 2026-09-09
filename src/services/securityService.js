import { FIREBASE_PATHS } from '../constants/firebase';
import { SECURITY_EVENT_TYPES, SECURITY_SETTINGS_DEFAULTS, SECURITY_THRESHOLDS } from '../constants/security';
import { updateData, readData } from './firebase';

const encode = (value) => {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  const binary = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(Number.parseInt(p1, 16))
  );
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(binary);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(text, 'utf8').toString('base64');
  }
  return text;
};

const decode = (value) => {
  if (!value) return value;
  try {
    if (typeof globalThis.atob === 'function') {
      const binary = globalThis.atob(value);
      const encoded = Array.from(binary)
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('');
      return decodeURIComponent(encoded);
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(value, 'base64').toString('utf8');
    }
  } catch (error) {
    return value;
  }
  return value;
};

export const encryptSensitiveData = (data) => encode(data);

export const decryptSensitiveData = (encryptedValue) => {
  const raw = decode(encryptedValue);
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

export const getUserSecuritySettings = async (userId) => {
  const settings = await readData(`${FIREBASE_PATHS.USERS}/${userId}/security`);
  return {
    ...SECURITY_SETTINGS_DEFAULTS,
    ...(settings || {}),
  };
};

export const updateUserSecuritySettings = async (userId, updates) => {
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await updateData(`${FIREBASE_PATHS.USERS}/${userId}/security`, payload);
  return payload;
};

export const detectSuspiciousActivity = (activity = {}) => {
  const suspiciousReasons = [];

  if (Number(activity.failedAttempts || 0) > SECURITY_THRESHOLDS.FAILED_ATTEMPTS_LIMIT) {
    suspiciousReasons.push('failed_attempts_limit_exceeded');
  }

  if (activity.newDevice && Number(activity.paymentAmount || 0) >= SECURITY_THRESHOLDS.HIGH_VALUE_PAYMENT) {
    suspiciousReasons.push('new_device_high_value_payment');
  }

  return {
    isSuspicious: suspiciousReasons.length > 0,
    suspiciousReasons,
    eventType: suspiciousReasons.length ? SECURITY_EVENT_TYPES.SUSPICIOUS_ACTIVITY : null,
  };
};

export const freezeAccount = async (userId, reason = 'suspicious_activity') => {
  const payload = {
    status: 'frozen',
    freezeReason: reason,
    frozenAt: new Date().toISOString(),
  };
  await updateData(`${FIREBASE_PATHS.USERS}/${userId}`, payload);
  return payload;
};
