export const SECURITY_CHANNELS = {
  SMS: 'sms',
  EMAIL: 'email',
};

export const SECURITY_SETTINGS_DEFAULTS = {
  twoFactorEnabled: false,
  biometricEnabled: false,
  loginAlerts: true,
  suspiciousAutoFreeze: true,
};

export const SECURITY_EVENT_TYPES = {
  TWO_FACTOR_SENT: 'two_factor_sent',
  TWO_FACTOR_VERIFIED: 'two_factor_verified',
  SETTINGS_UPDATED: 'settings_updated',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  ACCOUNT_FROZEN: 'account_frozen',
};

export const SECURITY_THRESHOLDS = {
  FAILED_ATTEMPTS_LIMIT: 5,
  HIGH_VALUE_PAYMENT: 500000,
};
