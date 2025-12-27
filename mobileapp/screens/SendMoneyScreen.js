import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const BACKEND_URL = 'http://localhost:8000';

export default function SendMoneyScreen({ token, onBack }) {
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        if (!phone || !amount || !pin) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);

        // Mock Logic for Demo Mode
        if (token === 'mock-token-123' || token === 'mock-token-admin') {
            setTimeout(() => {
                setLoading(false);
                Alert.alert('Success', `Successfully sent Rs. ${amount} to ${phone}`, [
                    { text: 'OK', onPress: onBack }
                ]);
            }, 1000);
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/wallet/transfer?recipient_phone=${phone}&amount=${amount}&pin=${pin}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', `Successfully sent Rs. ${amount} to ${phone}`, [
                    { text: 'OK', onPress: onBack }
                ]);
            } else {
                Alert.alert('Transfer Failed', data.detail || 'Something went wrong');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not connect to server. Try Demo Mode?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Send Money</Text>
                <View style={{ width: 32 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.infoBox}>
                    <MaterialCommunityIcons name="account-search-outline" size={24} color={COLORS.primary} />
                    <Text style={styles.infoText}>Enter the recipient's mobile number registered with Paykaro.</Text>
                </View>

                <Text style={styles.label}>Recipient Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 0300 1234567"
                    placeholderTextColor={COLORS.textLight}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                <Text style={[styles.label, { marginTop: 20 }]}>Amount (Rs.)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor={COLORS.textLight}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                />

                <Text style={[styles.label, { marginTop: 20 }]}>Transaction PIN</Text>
                <TextInput
                    style={styles.input}
                    placeholder="4-digit PIN"
                    placeholderTextColor={COLORS.textLight}
                    value={pin}
                    onChangeText={setPin}
                    secureTextEntry
                    keyboardType="number-pad"
                    maxLength={4}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleTransfer}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Confirm Transfer</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 65 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
    content: { paddingHorizontal: 20 },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: `${COLORS.primary}10`,
        padding: 18,
        borderRadius: 20,
        marginBottom: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: `${COLORS.primary}20`,
    },
    infoText: { color: COLORS.primary, fontSize: 13, flex: 1, marginLeft: 12, lineHeight: 20, fontWeight: '500' },
    label: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginBottom: 10, marginLeft: 5 },
    input: {
        backgroundColor: COLORS.white,
        color: COLORS.text,
        padding: 18,
        borderRadius: 18,
        fontSize: 16,
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
        marginTop: 40,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18, letterSpacing: 0.5 },
});
