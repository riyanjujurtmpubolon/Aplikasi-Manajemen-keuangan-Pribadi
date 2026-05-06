import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Edukasi() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edukasi Keuangan</Text>
            <Text style={styles.subtitle}>
                Pilih materi edukasi untuk meningkatkan literasi keuanganmu
            </Text>

            {/* MENU MENABUNG */}
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push('/edukasi/menabung')}
            >
                <View style={styles.iconBox}>
                    <Ionicons name="wallet" size={32} color="#22C55E" />
                </View>
                <View style={styles.textBox}>
                    <Text style={styles.cardTitle}>Menabung</Text>
                    <Text style={styles.cardDesc}>
                        Pelajari cara menabung yang efektif dan konsisten
                    </Text>
                </View>
            </TouchableOpacity>

            {/* MENU PENGELOLAAN KEUANGAN */}
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push('/edukasi/pengelolaan')}
            >
                <View style={styles.iconBox}>
                    <Ionicons name="stats-chart" size={32} color="#3B82F6" />
                </View>
                <View style={styles.textBox}>
                    <Text style={styles.cardTitle}>Pengelolaan Keuangan</Text>
                    <Text style={styles.cardDesc}>
                        Atur pemasukan dan pengeluaran dengan bijak
                    </Text>
                </View>
            </TouchableOpacity>

            {/* ===== BUTTON KEMBALI ===== */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace('/Home')}
            >
                <Ionicons name="arrow-back" size={20} color="#fff" />
                <Text style={styles.backButtonText}>Kembali ke Beranda</Text>
            </TouchableOpacity>
        </View>
    );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 20,
    },
    title: {
        marginTop: 32,
        fontSize: 26,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#6B7280',
        marginTop: 6,
        marginBottom: 24,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        elevation: 3,
        alignItems: 'center',
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textBox: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    cardDesc: {
        color: '#6B7280',
        marginTop: 4,
        fontSize: 13,
    },

    /* ===== BACK BUTTON ===== */
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4F46E5',
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 'auto',   // 🔥 dorong ke bawah
        gap: 8,
        marginBottom: 32,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
