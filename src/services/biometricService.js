export const isBiometricAvailable = async () => true;

export const authenticateWithBiometric = async () => ({
  success: true,
  provider: 'biometric',
  authenticatedAt: new Date().toISOString(),
});
