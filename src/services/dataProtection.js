import { encryptSensitiveData, decryptSensitiveData } from './encryptionService';

export const protectPayload = (payload, keyId) => encryptSensitiveData(payload, keyId);

export const unprotectPayload = (payload, keyId) => decryptSensitiveData(payload, keyId);
