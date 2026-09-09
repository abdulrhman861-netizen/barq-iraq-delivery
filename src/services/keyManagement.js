import { KEY_POLICIES } from '../constants/encryption';

const keyStore = new Map();

export const createKey = (keyId) => {
  const key = `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  const normalized = key.slice(0, Math.max(KEY_POLICIES.MIN_KEY_LENGTH, 32));
  keyStore.set(keyId, { key: normalized, createdAt: Date.now() });
  return normalized;
};

export const getKey = (keyId) => keyStore.get(keyId)?.key || createKey(keyId);

export const rotateKey = (keyId) => createKey(keyId);
