import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

export default function ProfileScreen({ onBack, onLogout }) {
    const [isBiometricEnabled, setBiometricEnabled] = useState(false);

    const handleFeatureMock = (feature) => {
        Alert.alert('Account Preference', `${feature} has been updated successfully!`);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account & Settings</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>A</Text>
                    </View>
                    <Text style={styles.userName}>Admin User</Text>
                    <Text style={styles.userPhone}>+92 300 1234567</Text>
                    <TouchableOpacity style={styles.editBtn} onPress={() => handleFeatureMock('Profile visibility')}>
                        <Text style={styles.editBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Security</Text>
                    <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureMock('Transaction PIN')}>
                        <MaterialCommunityIcons name="shield-lock-outline" size={24} color={COLORS.primary} />
                        <Text style={styles.menuText}>Change Transaction PIN</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                    <View style={styles.menuItem}>
                        <MaterialCommunityIcons name="fingerprint" size={24} color={COLORS.primary} />
                        <Text style={styles.menuText}>Biometric Login</Text>
                        <Switch
                            value={isBiometricEnabled}
                            onValueChange={setBiometricEnabled}
                            trackColor={{ false: '#e2e8f0', true: COLORS.primary }}
                            thumbColor={isBiometricEnabled ? '#fff' : '#fff'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureMock('Push Notifications')}>
                        <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.primary} />
                        <Text style={styles.menuText}>Notifications</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureMock('Language settings')}>
                        <MaterialCommunityIcons name="translate" size={24} color={COLORS.primary} />
                        <Text style={styles.menuText}>Language (English)</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureMock('Help ticket center')}>
                        <MaterialCommunityIcons name="help-circle-outline" size={24} color={COLORS.primary} />
                        <Text style={styles.menuText}>Help Center</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
                        <MaterialCommunityIcons name="logout" size={24} color={COLORS.error} />
                        <Text style={[styles.menuText, { color: COLORS.error }]}>Log Out</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.version}>Version 2.1.0 (Premium Layout)</Text>
            </ScrollView>
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
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    avatarContainer: { alignItems: 'center', marginBottom: 30 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    avatarText: { color: '#fff', fontSize: 42, fontWeight: 'bold' },
    userName: { color: COLORS.text, fontSize: 24, fontWeight: 'bold' },
    userPhone: { color: COLORS.textLight, fontSize: 15, marginTop: 4 },
    editBtn: {
        marginTop: 20,
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    editBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
    section: { marginTop: 30 },
    sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    menuItem: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    menuText: { color: COLORS.text, fontSize: 16, flex: 1, marginLeft: 15, fontWeight: '600' },
    version: { textAlign: 'center', color: COLORS.textLight, fontSize: 12, marginTop: 50 },
});
