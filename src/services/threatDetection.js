import { evaluateRiskScore } from './advancedSecurityService';

export const detectThreat = ({ failedAttempts, unknownDevice, unusualLocation }) => {
  const risk = evaluateRiskScore({ failedAttempts, unknownDevice, unusualLocation });

  return {
    detected: risk.score >= 20,
    ...risk,
    detectedAt: new Date().toISOString(),
  };
};
