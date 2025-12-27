import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const OPERATORS = [
    { id: 'jazz', label: 'Jazz', color: '#dc2626' },
    { id: 'telenor', label: 'Telenor', color: '#0284c7' },
    { id: 'zong', label: 'Zong', color: '#16a34a' },
    { id: 'ufone', label: 'Ufone', color: '#ea580c' },
];

export default function TopUpScreen({ onBack }) {
    const [operator, setOperator] = useState('jazz');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mobile Load</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.label}>Choose Operator</Text>
                <View style={styles.operatorContainer}>
                    {OPERATORS.map((op) => (
                        <TouchableOpacity
                            key={op.id}
                            style={[styles.opCircle, operator === op.id && { borderColor: COLORS.primary, borderWidth: 2 }]}
                            onPress={() => setOperator(op.id)}
                        >
                            <View style={[styles.opInner, { backgroundColor: op.color }]}>
                                <Text style={styles.opText}>{op.label[0]}</Text>
                            </View>
                            <Text style={styles.opLabel}>{op.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Recipient Mobile Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="03XX XXXXXXX"
                        placeholderTextColor={COLORS.textLight}
                        keyboardType="phone-pad"
                    />

                    <Text style={[styles.label, { marginTop: 20 }]}>Recharge Amount (Rs.)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Min. Rs. 50"
                        placeholderTextColor={COLORS.textLight}
                        keyboardType="number-pad"
                    />

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Confirm Recharge</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.infoCard, { backgroundColor: `${COLORS.primary}10` }]}>
                    <MaterialCommunityIcons name="shield-check-outline" size={24} color={COLORS.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Tax Advice</Text>
                        <Text style={styles.infoSubtitle}>Prevailing taxes will apply on your recharge as per operator policy.</Text>
                    </View>
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
    operatorContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    opCircle: { alignItems: 'center', padding: 8, borderRadius: 15, borderWidth: 2, borderColor: 'transparent' },
    opInner: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    opText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    opLabel: { color: COLORS.text, fontSize: 12, marginTop: 8, fontWeight: '600' },
    formContainer: { marginTop: 10 },
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
    infoCard: { flexDirection: 'row', padding: 15, borderRadius: 15, marginTop: 30, marginBottom: 40 },
    infoContent: { marginLeft: 12, flex: 1 },
    infoTitle: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
    infoSubtitle: { color: COLORS.primary, fontSize: 12, marginTop: 2, lineHeight: 18 },
});
