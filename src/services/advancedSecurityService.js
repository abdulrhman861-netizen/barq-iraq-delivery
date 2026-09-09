import { SECURITY_ALERT_LEVELS } from '../constants/security';

export const evaluateRiskScore = ({ failedAttempts = 0, unknownDevice = false, unusualLocation = false }) => {
  let score = failedAttempts * 15;
  if (unknownDevice) score += 25;
  if (unusualLocation) score += 30;

  const level = score >= 70
    ? SECURITY_ALERT_LEVELS.CRITICAL
    : score >= 45
      ? SECURITY_ALERT_LEVELS.HIGH
      : score >= 20
        ? SECURITY_ALERT_LEVELS.MEDIUM
        : SECURITY_ALERT_LEVELS.LOW;

  return { score, level };
};

export const shouldRequireStepUpAuth = (risk) => risk.level === SECURITY_ALERT_LEVELS.HIGH || risk.level === SECURITY_ALERT_LEVELS.CRITICAL;
