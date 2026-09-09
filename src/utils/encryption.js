const toBase64 = (value) => {
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(value);
  }

  return value
    .split('')
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
};

export const encryptText = (plainText, key = '') => {
  if (!plainText && plainText !== 0) {
    return '';
  }

  const data = JSON.stringify({ keyHint: key.length, value: String(plainText) });
  return toBase64(data);
};

export const encryptObject = (payload, key = '') => encryptText(JSON.stringify(payload || {}), key);
