import { encryptObject, encryptText } from '../utils/encryption';
import { decryptObject, decryptText } from '../utils/decryption';
import { getKey } from './keyManagement';

export const encryptSensitiveData = (value, keyId = 'default') => {
  const key = getKey(keyId);
  if (typeof value === 'object') {
    return encryptObject(value, key);
  }

  return encryptText(value, key);
};

export const decryptSensitiveData = (encryptedValue, keyId = 'default') => {
  const key = getKey(keyId);
  void key;

  const objectValue = decryptObject(encryptedValue);
  if (Object.keys(objectValue).length > 0) {
    return objectValue;
  }

  return decryptText(encryptedValue);
};
