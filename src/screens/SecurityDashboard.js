import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SecurityContext } from '../contexts/SecurityContext';
import ThreatAlert from '../components/ThreatAlert';

const SecurityDashboard = () => {
  const { alerts, monitorSecurityEvent } = useContext(SecurityContext);
  const [fallbackAlert, setFallbackAlert] = useState(null);

  useEffect(() => {
    const result = monitorSecurityEvent({ failedAttempts: 3, unknownDevice: true, unusualLocation: true });
    setFallbackAlert(result);
  }, [monitorSecurityEvent]);

  const list = alerts.length > 0 ? alerts : fallbackAlert ? [fallbackAlert] : [];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 10, textAlign: 'right' }}>لوحة الأمان</Text>
      {list.map((alert, index) => (
        <ThreatAlert key={`${alert.detectedAt || index}`} alert={alert} />
      ))}
    </ScrollView>
  );
};

export default SecurityDashboard;
