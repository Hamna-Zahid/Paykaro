import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

export default function QRCodeScreen({ onBack }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scan & Pay</Text>
                <View style={{ width: 32 }} />
            </View>

            <View style={styles.scannerContainer}>
                <View style={styles.scannerOverlay}>
                    <View style={styles.scanTarget}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                </View>
                <Text style={styles.scanText}>Post the QR code within the frame</Text>
            </View>

            <View style={styles.bottomSection}>
                <TouchableOpacity style={styles.actionBtn}>
                    <MaterialCommunityIcons name="image" size={28} color={COLORS.text} />
                    <Text style={styles.actionText}>Upload QR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <MaterialCommunityIcons name="qrcode" size={28} color={COLORS.text} />
                    <Text style={styles.actionText}>My QR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 65,
        zIndex: 10,
    },
    headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
    scannerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scannerOverlay: {
        width: 250,
        height: 250,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        position: 'relative',
    },
    scanTarget: { flex: 1 },
    corner: { position: 'absolute', width: 40, height: 40, borderColor: COLORS.primary, borderWidth: 4 },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 20 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 20 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 20 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 20 },
    scanText: { color: COLORS.white, marginTop: 30, fontSize: 14, fontWeight: '500' },
    bottomSection: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionBtn: { alignItems: 'center' },
    actionText: { color: COLORS.text, fontSize: 12, marginTop: 8, fontWeight: '600' },
});
