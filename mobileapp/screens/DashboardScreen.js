import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const BACKEND_URL = 'http://localhost:8000';

const ACTION_GRID = [
    { id: 'send', icon: 'send', label: 'Send Money', color: '#1fb47e' },
    { id: 'bills', icon: 'file-document-outline', label: 'Bill Payment', color: '#f59e0b' },
    { id: 'packages', icon: 'package-variant', label: 'Mobile Packages', color: '#38bdf8' },
    { id: 'topup', icon: 'cellphone-arrow-down', label: 'Mobile Load', color: '#ec4899' },
    { id: 'qr', icon: 'qrcode-scan', label: 'QR Scan', color: '#8b5cf6' },
    { id: 'cashpoints', icon: 'map-marker-radius', label: 'Cash Points', color: '#1fb47e' },
    { id: 'promotions', icon: 'sale', label: 'Promotions', color: '#ef4444' },
    { id: 'history', icon: 'history', label: 'History', color: '#64748B' },
];

export default function DashboardScreen({ token, onLogout, onNavigate }) {
    const [userData, setUserData] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (token === 'mock-token-123' || token === 'mock-token-admin') {
            setUserData({ full_name: 'Demo User', balance: 75200.0 });
            setTransactions([
                { transaction_id: 'TX-101', merchant_id: 'Amazon Mall', amount: -2500, type: 'Payment' },
                { transaction_id: 'TX-102', merchant_id: 'Salary Transfer', amount: 50000, type: 'Deposit' }
            ]);
        } else {
            fetchUserData();
            const interval = setInterval(fetchTransactions, 2000);
            return () => clearInterval(interval);
        }
    }, [token]);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setUserData(data);
            } else if (response.status === 401) {
                onLogout();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/transactions/live`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.status === 'success') {
                setTransactions(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => onNavigate('profile')} style={styles.profileBtn}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{userData?.full_name ? userData.full_name[0] : 'U'}</Text>
                        </View>
                        <View>
                            <Text style={styles.nameText}>{userData?.full_name || 'User'}</Text>
                            <Text style={styles.limitText}>View Benefits</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn} onPress={onLogout}>
                            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Paykaro Balance</Text>
                    <View style={styles.balanceRow}>
                        <Text style={styles.currency}>Rs.</Text>
                        <Text style={styles.balanceAmount}>{userData?.balance?.toLocaleString() || '0.00'}</Text>
                        <TouchableOpacity style={styles.refreshBtn}>
                            <MaterialCommunityIcons name="refresh" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Action Grid */}
            <View style={styles.gridSection}>
                <View style={styles.grid}>
                    {ACTION_GRID.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            style={styles.gridItem}
                            onPress={() => onNavigate(action.id)}
                        >
                            <View style={[styles.gridIcon, { backgroundColor: `${action.color}15` }]}>
                                <MaterialCommunityIcons name={action.icon} size={28} color={action.color} />
                            </View>
                            <Text style={styles.gridLabel}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Promotion Slider (Mock) */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoSlider}>
                <View style={[styles.promoCard, { backgroundColor: '#1fb47e' }]}>
                    <Text style={styles.promoTitle}>Win Rs. 1 Lakh!</Text>
                    <Text style={styles.promoBody}>Pay 3 bills and enter the lucky draw.</Text>
                </View>
                <View style={[styles.promoCard, { backgroundColor: '#f59e0b' }]}>
                    <Text style={styles.promoTitle}>Cashback Deals</Text>
                    <Text style={styles.promoBody}>Get 10% back on your first top-up.</Text>
                </View>
            </ScrollView>

            {/* Recent Activity */}
            <View style={styles.activitySection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activities</Text>
                    <TouchableOpacity onPress={() => onNavigate('history')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                {transactions.map((txn, idx) => (
                    <View key={txn.transaction_id || idx} style={styles.txnCard}>
                        <View style={styles.txnIcon}>
                            <MaterialCommunityIcons
                                name={txn.amount > 0 ? 'arrow-bottom-left' : 'arrow-top-right'}
                                size={20}
                                color={txn.amount > 0 ? '#10b981' : '#f43f5e'}
                            />
                        </View>
                        <View style={styles.txnDetails}>
                            <Text style={styles.txnName}>{txn.merchant_id || 'Transfer'}</Text>
                            <Text style={styles.txnType}>{txn.type || 'Electronic'}</Text>
                        </View>
                        <Text style={[styles.txnAmount, { color: txn.amount > 0 ? '#10b981' : COLORS.text }]}>
                            {txn.amount > 0 ? '+' : ''}Rs. {Math.abs(txn.amount).toLocaleString()}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    header: {
        backgroundColor: COLORS.primary,
        paddingTop: 65,
        paddingBottom: 90,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    profileBtn: { flexDirection: 'row', alignItems: 'center' },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    nameText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    limitText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
    headerIcons: { flexDirection: 'row' },
    iconBtn: { marginLeft: 15 },
    balanceCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        position: 'absolute',
        bottom: -50,
        left: 20,
        right: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    balanceLabel: { color: COLORS.textLight, fontSize: 14, fontWeight: '600' },
    balanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    currency: { color: COLORS.text, fontSize: 18, fontWeight: '600', marginRight: 5 },
    balanceAmount: { color: COLORS.text, fontSize: 32, fontWeight: 'bold', flex: 1 },
    refreshBtn: { padding: 5 },
    gridSection: { marginTop: 70, paddingHorizontal: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    gridItem: {
        width: '23%',
        alignItems: 'center',
        marginBottom: 20,
    },
    gridIcon: {
        width: 55,
        height: 55,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    gridLabel: { color: COLORS.text, fontSize: 10, textAlign: 'center', fontWeight: '500' },
    promoSlider: { paddingLeft: 20, marginBottom: 30 },
    promoCard: {
        width: 280,
        padding: 20,
        borderRadius: 20,
        marginRight: 15,
    },
    promoTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    promoBody: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 5 },
    activitySection: { paddingHorizontal: 20, paddingBottom: 40 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    seeAll: { color: COLORS.primary, fontWeight: 'bold' },
    txnCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 8,
    },
    txnIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    txnDetails: { flex: 1 },
    txnName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
    txnType: { fontSize: 12, color: COLORS.textLight },
    txnAmount: { fontSize: 16, fontWeight: 'bold' },
});
