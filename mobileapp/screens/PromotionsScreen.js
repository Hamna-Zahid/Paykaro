import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const MOCK_DEALS = [
    { id: '1', title: '50% Cashback', brand: 'Daraz', desc: 'Get up to Rs. 500 back on your first order.', color: '#f97316' },
    { id: '2', title: 'Buy 1 Get 1', brand: 'KFC', desc: 'Pay with Paykaro and get a free Zinger.', color: '#ef4444' },
    { id: '3', title: 'Rs. 200 Discount', brand: 'Total Parco', desc: 'Flat discount on fuel above Rs. 2000.', color: '#10b981' },
];

export default function PromotionsScreen({ onBack }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Promotions & Deals</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.subtitle}>Handpicked deals and discounts only for you.</Text>

                {MOCK_DEALS.map((deal) => (
                    <TouchableOpacity key={deal.id} style={styles.dealCard}>
                        <View style={[styles.brandLogo, { backgroundColor: deal.color }]}>
                            <Text style={styles.logoChar}>{deal.brand[0]}</Text>
                        </View>
                        <View style={styles.dealInfo}>
                            <Text style={styles.brandName}>{deal.brand}</Text>
                            <Text style={styles.dealTitle}>{deal.title}</Text>
                            <Text style={styles.dealDesc}>{deal.desc}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                ))}
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
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
    content: { paddingHorizontal: 20 },
    subtitle: { color: COLORS.textLight, fontSize: 14, marginBottom: 25 },
    dealCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    brandLogo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    logoChar: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    dealInfo: { flex: 1 },
    brandName: { color: COLORS.textLight, fontSize: 12, fontWeight: '600' },
    dealTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginVertical: 2 },
    dealDesc: { color: COLORS.textLight, fontSize: 13 },
});
