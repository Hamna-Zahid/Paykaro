import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const MOCK_POINTS = [
    { id: '1', name: 'Zahid Mobile Store', distance: '0.5 km', address: 'Block 4, Gulshan-e-Iqbal' },
    { id: '2', name: 'Al-Madina General Store', distance: '1.2 km', address: 'Shop 12, Tariq Road' },
    { id: '3', name: 'Quick Cash Point', distance: '2.4 km', address: 'Plot 45, North Nazimabad' },
];

export default function CashPointsScreen({ onBack }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cash Points Near You</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.subtitle}>Find Paykaro agents to deposit or withdraw cash safely.</Text>

                {MOCK_POINTS.map((point) => (
                    <View key={point.id} style={styles.pointCard}>
                        <View style={styles.pointIcon}>
                            <MaterialCommunityIcons name="store" size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.pointDetails}>
                            <Text style={styles.pointName}>{point.name}</Text>
                            <Text style={styles.pointAddress}>{point.address}</Text>
                            <Text style={styles.pointDistance}>{point.distance} away</Text>
                        </View>
                        <TouchableOpacity style={styles.directionBtn}>
                            <MaterialCommunityIcons name="directions" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
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
    pointCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 15,
        borderRadius: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    pointIcon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: `${COLORS.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    pointDetails: { flex: 1 },
    pointName: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
    pointAddress: { color: COLORS.textLight, fontSize: 12, marginTop: 2 },
    pointDistance: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', marginTop: 4 },
    directionBtn: { padding: 10 },
});
