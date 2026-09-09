import React, { createContext, useCallback, useState } from 'react';
import { detectThreat } from '../services/threatDetection';

export const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const monitorSecurityEvent = useCallback((eventData) => {
    const threat = detectThreat(eventData || {});
    if (threat.detected) {
      setAlerts((prev) => [threat, ...prev].slice(0, 50));
    }

    return threat;
  }, []);

  return (
    <SecurityContext.Provider value={{ alerts, monitorSecurityEvent }}>
      {children}
    </SecurityContext.Provider>
  );
};
