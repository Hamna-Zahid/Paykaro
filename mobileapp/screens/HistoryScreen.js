import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const MOCK_HISTORY = [
    { id: '1', title: 'Amazon Shopping', amount: -2500.00, date: 'Oct 24, 2023', icon: 'cart' },
    { id: '2', title: 'Salary Credited', amount: 45000.00, date: 'Oct 23, 2023', icon: 'bank' },
    { id: '3', title: 'Starbucks Coffee', amount: -650.50, date: 'Oct 22, 2023', icon: 'coffee' },
    { id: '4', title: 'Netflix Subscription', amount: -1100.99, date: 'Oct 20, 2023', icon: 'television' },
    { id: '5', title: 'Bill Payment: Gas', amount: -1200.00, date: 'Oct 18, 2023', icon: 'fire' },
];

export default function HistoryScreen({ onBack }) {
    const [search, setSearch] = useState('');

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
                <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={[styles.amount, { color: item.amount > 0 ? COLORS.success : COLORS.text }]}>
                {item.amount > 0 ? '+' : ''}Rs. {Math.abs(item.amount).toLocaleString()}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transaction History</Text>
                <View style={{ width: 32 }} />
            </View>

            <View style={styles.searchSection}>
                <MaterialCommunityIcons name="magnify" size={20} color={COLORS.textLight} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search transactions..."
                    placeholderTextColor={COLORS.textLight}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={MOCK_HISTORY}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 65 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        marginHorizontal: 20,
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchIcon: { marginRight: 10 },
    searchBar: {
        flex: 1,
        color: COLORS.text,
        paddingVertical: 12,
        fontSize: 14,
    },
    list: { paddingHorizontal: 20, paddingBottom: 20 },
    card: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    details: { flex: 1 },
    title: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
    date: { color: COLORS.textLight, fontSize: 12, marginTop: 2 },
    amount: { fontSize: 16, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: COLORS.textLight, marginTop: 40 },
});
