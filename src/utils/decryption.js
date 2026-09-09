const fromBase64 = (value) => {
  if (!value) return '';

  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(value);
  }

  if (value.length % 2 !== 0) {
    return value;
  }

  let output = '';
  for (let i = 0; i < value.length; i += 2) {
    output += String.fromCharCode(parseInt(value.slice(i, i + 2), 16));
  }
  return output;
};

export const decryptText = (cipherText) => {
  if (!cipherText) {
    return '';
  }

  const rawValue = fromBase64(cipherText);
  try {
    const parsed = JSON.parse(rawValue);
    return parsed.value ?? '';
  } catch (error) {
    return rawValue;
  }
};

export const decryptObject = (cipherText) => {
  const value = decryptText(cipherText);
  try {
    return JSON.parse(value);
  } catch (error) {
    return {};
  }
};
