import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import SendMoneyScreen from './screens/SendMoneyScreen';
import HistoryScreen from './screens/HistoryScreen';
import BillPaymentScreen from './screens/BillPaymentScreen';
import TopUpScreen from './screens/TopUpScreen';
import ProfileScreen from './screens/ProfileScreen';
import CashPointsScreen from './screens/CashPointsScreen';
import QRCodeScreen from './screens/QRCodeScreen';
import PromotionsScreen from './screens/PromotionsScreen';
import MobilePackagesScreen from './screens/MobilePackagesScreen';

export default function App() {
  const [token, setToken] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  const handleLogout = () => {
    setToken(null);
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    if (!token) return <LoginScreen onLogin={setToken} />;

    switch (currentScreen) {
      case 'send':
        return <SendMoneyScreen token={token} onBack={() => setCurrentScreen('dashboard')} />;
      case 'history':
        return <HistoryScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'bills':
        return <BillPaymentScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'topup':
        return <TopUpScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'cashpoints':
        return <CashPointsScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'qr':
        return <QRCodeScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'promotions':
        return <PromotionsScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'packages':
        return <MobilePackagesScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'profile':
        return <ProfileScreen onBack={() => setCurrentScreen('dashboard')} onLogout={handleLogout} />;
      case 'dashboard':
      default:
        return (
          <DashboardScreen
            token={token}
            onLogout={handleLogout}
            onNavigate={setCurrentScreen}
          />
        );
    }
  };

  const renderBottomNav = () => {
    if (!token) return null;
    const navItems = [
      { id: 'dashboard', icon: 'home-variant', label: 'Home' },
      { id: 'cashpoints', icon: 'map-marker-radius', label: 'Cash Points' },
      { id: 'qr', icon: 'qrcode-scan', label: 'Scan' },
      { id: 'promotions', icon: 'tag-multiple-outline', label: 'Promos' },
      { id: 'profile', icon: 'account-circle-outline', label: 'Account' },
    ];

    return (
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => setCurrentScreen(item.id)}
          >
            <View style={[styles.navIconContainer, currentScreen === item.id && styles.activeIconBg]}>
              <MaterialCommunityIcons
                name={item.icon}
                size={26}
                color={currentScreen === item.id ? '#1fb47e' : '#64748b'}
              />
            </View>
            <Text style={[styles.navLabel, { color: currentScreen === item.id ? '#1fb47e' : '#64748b' }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
      {renderBottomNav()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 95,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: 35,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconContainer: {
    width: 44,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeIconBg: {
    backgroundColor: '#1fb47e10',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
