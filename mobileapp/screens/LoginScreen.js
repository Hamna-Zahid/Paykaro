import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/Colors';

const BACKEND_URL = 'http://localhost:8000';

export default function LoginScreen({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [full_name, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || !pin) {
      Alert.alert('Error', 'Please enter your phone number and PIN');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', phoneNumber);
      formData.append('password', pin);

      const response = await fetch(`${BACKEND_URL}/token`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.access_token);
      } else {
        Alert.alert('Login Failed', data.detail || 'Invalid phone number or PIN');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!phoneNumber || !pin || !full_name) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/register?username=${phoneNumber}&phone=${phoneNumber}&full_name=${full_name}&password=${pin}&pin=${pin}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Account created! You can now sign in.');
        setIsRegistering(false);
      } else {
        Alert.alert('Registration Failed', data.detail || 'Could not create account');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>P</Text>
        </View>
        <Text style={styles.title}>Paykaro</Text>
        <Text style={styles.subtitle}>{isRegistering ? 'Create your account' : 'Mobile Fintech Simplified'}</Text>
      </View>

      <View style={styles.form}>
        {isRegistering && (
          <>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Hamna Zahid"
              placeholderTextColor="#94a3b8"
              value={full_name}
              onChangeText={setFullName}
            />
          </>
        )}

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 0300 0000000"
          placeholderTextColor="#94a3b8"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>{isRegistering ? 'Choose 4-digit PIN' : 'Transaction PIN'}</Text>
        <TextInput
          style={styles.input}
          placeholder="4-digit PIN"
          placeholderTextColor="#94a3b8"
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          keyboardType="number-pad"
          maxLength={4}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={isRegistering ? handleRegister : handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Sign In'}</Text>}
        </TouchableOpacity>

        {!isRegistering && (
          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => onLogin('mock-token-admin')}
          >
            <Text style={styles.demoButtonText}>Try Demo Mode</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{isRegistering ? 'Already have an account? ' : 'New to Paykaro? '} </Text>
        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.linkText}>{isRegistering ? 'Sign In' : 'Register Now'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.white,
    color: COLORS.text,
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 18,
    marginTop: 10,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  demoButton: {
    marginTop: 15,
    padding: 10,
  },
  demoButtonText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textLight,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
