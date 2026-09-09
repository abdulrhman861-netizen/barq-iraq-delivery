const tokenStore = new Map();

const createRawToken = () => `tk_${Date.now()}_${Math.random().toString(36).slice(2, 14)}`;

export const issueToken = ({ userId, expiresInSeconds = 3600 }) => {
  const token = createRawToken();
  tokenStore.set(token, {
    userId,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  });
  return token;
};

export const validateToken = (token) => {
  const tokenData = tokenStore.get(token);
  if (!tokenData) return false;
  if (Date.now() > tokenData.expiresAt) {
    tokenStore.delete(token);
    return false;
  }

  return true;
};

export const revokeToken = (token) => tokenStore.delete(token);
