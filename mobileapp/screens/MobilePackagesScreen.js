import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const PACKAGES = [
    { id: '1', name: 'Weekly Mega', data: '15 GB', onnet: 'Unlimited', price: 250, operator: 'Jazz' },
    { id: '2', name: 'Monthly Social', data: '10 GB', onnet: '500 Mins', price: 180, operator: 'Telenor' },
    { id: '3', name: 'Daily Refresh', data: '1 GB', onnet: '100 Mins', price: 25, operator: 'Zong' },
];

export default function MobilePackagesScreen({ onBack }) {
    const [activeTab, setActiveTab] = useState('Data');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mobile Packages</Text>
                <View style={{ width: 32 }} />
            </View>

            <View style={styles.tabs}>
                {['Data', 'Voice', 'SMS', 'Hybrid'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.content}>
                {PACKAGES.map(pkg => (
                    <View key={pkg.id} style={styles.pkgCard}>
                        <View style={styles.pkgTop}>
                            <View>
                                <Text style={styles.pkgName}>{pkg.name}</Text>
                                <Text style={styles.pkgOp}>{pkg.operator} Bundle</Text>
                            </View>
                            <Text style={styles.pkgPrice}>Rs. {pkg.price}</Text>
                        </View>
                        <View style={styles.pkgSpecs}>
                            <View style={styles.spec}>
                                <MaterialCommunityIcons name="database" size={16} color={COLORS.primary} />
                                <Text style={styles.specText}>{pkg.data}</Text>
                            </View>
                            <View style={styles.spec}>
                                <MaterialCommunityIcons name="phone" size={16} color={COLORS.primary} />
                                <Text style={styles.specText}>{pkg.onnet}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.subBtn}>
                            <Text style={styles.subBtnText}>Subscribe</Text>
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
        marginBottom: 15,
    },
    headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
    tabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: COLORS.border },
    activeTab: { borderBottomColor: COLORS.primary },
    tabText: { color: COLORS.textLight, fontWeight: '600' },
    activeTabText: { color: COLORS.primary },
    content: { paddingHorizontal: 20 },
    pkgCard: {
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    pkgTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    pkgName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    pkgOp: { fontSize: 12, color: COLORS.textLight },
    pkgPrice: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
    pkgSpecs: { flexDirection: 'row', marginBottom: 20 },
    spec: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    specText: { marginLeft: 6, color: COLORS.text, fontWeight: '600' },
    subBtn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 12, alignItems: 'center' },
    subBtnText: { color: '#fff', fontWeight: 'bold' },
});
