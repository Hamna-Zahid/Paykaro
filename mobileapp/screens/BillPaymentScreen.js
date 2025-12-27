import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const BILL_TYPES = [
    { id: 'elec', icon: 'lightning-bolt', label: 'Electricity' },
    { id: 'gas', icon: 'fire', label: 'Gas' },
    { id: 'water', icon: 'water', label: 'Water' },
    { id: 'net', icon: 'wifi', label: 'Internet' },
];

export default function BillPaymentScreen({ onBack }) {
    const [selected, setSelected] = useState('elec');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pay Utility Bills</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.label}>Select Bill Category</Text>
                <View style={styles.grid}>
                    {BILL_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            style={[styles.typeItem, selected === type.id && styles.typeSelected]}
                            onPress={() => setSelected(type.id)}
                        >
                            <View style={[styles.iconBox, selected === type.id && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <MaterialCommunityIcons
                                    name={type.icon}
                                    size={28}
                                    color={selected === type.id ? '#fff' : COLORS.primary}
                                />
                            </View>
                            <Text style={[styles.typeLabel, selected === type.id && styles.labelSelected]}>
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.formView}>
                    <Text style={styles.label}>Consumer Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 1234567890123"
                        placeholderTextColor={COLORS.textLight}
                        keyboardType="number-pad"
                    />

                    <Text style={[styles.label, { marginTop: 20 }]}>Amount (Rs.)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        placeholderTextColor={COLORS.textLight}
                        keyboardType="decimal-pad"
                    />

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Pay Bill Now</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                    <MaterialCommunityIcons name="information-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.infoText}>Bills are processed instantly. Keep your transaction ID for reference.</Text>
                </View>
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
        marginBottom: 25,
    },
    headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
    content: { paddingHorizontal: 20 },
    label: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
    grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    typeItem: {
        backgroundColor: COLORS.surface,
        width: '23%',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    typeSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    iconBox: { marginBottom: 8 },
    typeLabel: { color: COLORS.text, fontSize: 10, fontWeight: '600' },
    labelSelected: { color: '#fff' },
    formView: { marginTop: 10 },
    input: {
        backgroundColor: COLORS.surface,
        color: COLORS.text,
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 18,
        borderRadius: 12,
        marginTop: 40,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: `${COLORS.primary}10`,
        padding: 15,
        borderRadius: 12,
        marginTop: 30,
        marginBottom: 40,
        alignItems: 'center',
    },
    infoText: { color: COLORS.primary, fontSize: 12, flex: 1, marginLeft: 10, lineHeight: 18 },
});
