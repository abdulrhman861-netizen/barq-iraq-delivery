import React, { createContext, useCallback, useState } from 'react';
import { getMerchantDashboardData, getCaptainDashboardData, getAdminDashboardData } from '../services/dashboardService';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async (role) => {
    try {
      setIsLoading(true);
      setError(null);

      const dataByRole = {
        merchant: getMerchantDashboardData,
        captain: getCaptainDashboardData,
        admin: getAdminDashboardData,
      };

      const fetchData = dataByRole[role] || getMerchantDashboardData;
      const data = await fetchData();
      setDashboardData(data);
      return data;
    } catch (err) {
      setError(err.message || 'تعذر تحميل لوحة التحكم');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        isLoading,
        error,
        loadDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
