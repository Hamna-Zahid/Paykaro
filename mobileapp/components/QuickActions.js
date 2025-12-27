import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ACTIONS = [
    { id: 'send', icon: 'send', label: 'Send Money', color: '#38bdf8' },
    { id: 'bills', icon: 'file-document-outline', label: 'Bill Pay', color: '#f59e0b' },
    { id: 'topup', icon: 'cellphone-arrow-down', label: 'Top Up', color: '#10b981' },
    { id: 'history', icon: 'history', label: 'History', color: '#94a3b8' },
];

export default function QuickActions({ onAction }) {
    return (
        <View style={styles.container}>
            {ACTIONS.map((action) => (
                <TouchableOpacity
                    key={action.id}
                    style={styles.actionItem}
                    onPress={() => onAction(action.id)}
                >
                    <View style={[styles.iconContainer, { backgroundColor: `${action.color}20` }]}>
                        <MaterialCommunityIcons name={action.icon} size={28} color={action.color} />
                    </View>
                    <Text style={styles.label}>{action.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    actionItem: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '500',
    },
});
