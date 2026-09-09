import React, { createContext, useCallback, useMemo, useState } from 'react';
import { DASHBOARD_PERIODS } from '../constants/dashboard';
import { fetchDashboardData } from '../services/dashboardService';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(DASHBOARD_PERIODS.MONTHLY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async ({ role, userId, period = selectedPeriod }) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchDashboardData(role, userId, period);
      setDashboardData(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod]);

  const value = useMemo(() => ({
    dashboardData,
    selectedPeriod,
    setSelectedPeriod,
    isLoading,
    error,
    loadDashboard,
  }), [dashboardData, selectedPeriod, isLoading, error, loadDashboard]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
