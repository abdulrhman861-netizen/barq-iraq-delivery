import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { COLORS } from './src/constants';
import {
  ensureWallet,
  firebaseMode,
  setUserRole,
  upsertUserProfile,
} from './src/services/firestoreDemo';
import WebDemoLoginScreen from './src/screens/dashboard/WebDemoLoginScreen';
import DemoDashboardScreen from './src/screens/dashboard/DemoDashboardScreen';
import ChatDemoScreen from './src/screens/dashboard/ChatDemoScreen';
import CreateOrderDemoScreen from './src/screens/dashboard/CreateOrderDemoScreen';
import RatingsDemoScreen from './src/screens/dashboard/RatingsDemoScreen';
import NotificationsDemoScreen from './src/screens/dashboard/NotificationsDemoScreen';
import WalletFinanceDemoScreen from './src/screens/dashboard/WalletFinanceDemoScreen';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [role, setRole] = useState('merchant');

  const handleLogin = async ({ uid, displayName, role: selectedRole }) => {
    const payload = {
      uid: uid || `demo-user-${Date.now()}`,
      displayName: displayName || 'مستخدم',
      role: selectedRole || 'merchant',
    };
    await upsertUserProfile(payload);
    await ensureWallet({ ownerUserId: payload.uid, ownerRole: payload.role });
    setRole(payload.role);
    setUser(payload);
    setCurrentScreen('dashboard');
  };

  const handleRoleChange = async (nextRole) => {
    if (!user) return;
    await setUserRole({ uid: user.uid, role: nextRole });
    await ensureWallet({ ownerUserId: user.uid, ownerRole: nextRole });
    setRole(nextRole);
    setUser((prev) => ({ ...prev, role: nextRole }));
  };

  const handleLogout = () => {
    setUser(null);
    setRole('merchant');
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    if (!user) {
      return <WebDemoLoginScreen onLogin={handleLogin} />;
    }

    if (currentScreen === 'chat') {
      return <ChatDemoScreen userId={user.uid} role={role} onBack={() => setCurrentScreen('dashboard')} />;
    }

    if (currentScreen === 'createOrder') {
      return <CreateOrderDemoScreen userId={user.uid} onBack={() => setCurrentScreen('dashboard')} />;
    }

    if (currentScreen === 'ratings') {
      return <RatingsDemoScreen userId={user.uid} role={role} onBack={() => setCurrentScreen('dashboard')} />;
    }

    if (currentScreen === 'notifications') {
      return <NotificationsDemoScreen userId={user.uid} onBack={() => setCurrentScreen('dashboard')} />;
    }

    if (currentScreen === 'wallet') {
      return <WalletFinanceDemoScreen userId={user.uid} role={role} onBack={() => setCurrentScreen('dashboard')} />;
    }

    return (
      <DemoDashboardScreen
        currentRole={role}
        onRoleChange={handleRoleChange}
        onNavigate={(target) => setCurrentScreen(target)}
        firebaseMode={firebaseMode}
        onLogout={handleLogout}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default App;
