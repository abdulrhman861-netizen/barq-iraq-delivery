export const SECURITY_ALERT_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const SECURITY_EVENTS = {
  LOGIN_ATTEMPT: 'login_attempt',
  ROLE_CHANGE: 'role_change',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
};

export const SECURITY_DEFAULT_PERMISSIONS = {
  merchant: ['orders.read', 'payments.read', 'reports.read'],
  captain: ['orders.read', 'earnings.read'],
  admin: ['*'],
};
