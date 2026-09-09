import React, { createContext, useCallback, useMemo, useState } from 'react';
import { createAuditLog, getAuditLogs } from '../services/auditLog';
import { detectSuspiciousActivity, freezeAccount, getUserSecuritySettings, updateUserSecuritySettings } from '../services/securityService';
import { sendTwoFactorCode, verifyTwoFactorCode } from '../services/twoFactorAuth';
import { SECURITY_EVENT_TYPES } from '../constants/security';

export const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeSecurity = useCallback(async (userId) => {
    setIsLoading(true);
    try {
      const [userSettings, logs] = await Promise.all([
        getUserSecuritySettings(userId),
        getAuditLogs({ userId }),
      ]);
      setSettings(userSettings);
      setAuditLogs(logs);
      return { userSettings, logs };
    } catch (err) {
      setError(err.message || 'Failed to initialize security');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendCode = useCallback(async ({ userId, channel, target }) => {
    const result = await sendTwoFactorCode({ userId, channel, target });
    await createAuditLog({ userId, eventType: SECURITY_EVENT_TYPES.TWO_FACTOR_SENT, metadata: { channel } });
    return result;
  }, []);

  const verifyCode = useCallback(async ({ userId, code }) => {
    const result = await verifyTwoFactorCode({ userId, code });
    if (result.success) {
      await createAuditLog({ userId, eventType: SECURITY_EVENT_TYPES.TWO_FACTOR_VERIFIED });
    }
    return result;
  }, []);

  const updateSettings = useCallback(async (userId, updates) => {
    const saved = await updateUserSecuritySettings(userId, updates);
    setSettings((prev) => ({ ...(prev || {}), ...saved }));
    await createAuditLog({ userId, eventType: SECURITY_EVENT_TYPES.SETTINGS_UPDATED, metadata: updates });
    return saved;
  }, []);

  const evaluateThreat = useCallback(async (userId, activity) => {
    const result = detectSuspiciousActivity(activity);

    if (result.isSuspicious) {
      await createAuditLog({ userId, eventType: SECURITY_EVENT_TYPES.SUSPICIOUS_ACTIVITY, metadata: result });
      if (settings?.suspiciousAutoFreeze !== false) {
        await freezeAccount(userId, result.suspiciousReasons.join(','));
        await createAuditLog({ userId, eventType: SECURITY_EVENT_TYPES.ACCOUNT_FROZEN, metadata: result });
      }
    }

    const logs = await getAuditLogs({ userId });
    setAuditLogs(logs);
    return result;
  }, [settings]);

  const value = useMemo(() => ({
    settings,
    auditLogs,
    isLoading,
    error,
    initializeSecurity,
    sendCode,
    verifyCode,
    updateSettings,
    evaluateThreat,
  }), [settings, auditLogs, isLoading, error, initializeSecurity, sendCode, verifyCode, updateSettings, evaluateThreat]);

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>;
};
