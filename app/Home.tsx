import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Home() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* HEADER */}
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
                Kelola keuanganmu dengan mudah 💰
            </Text>

            {/* MENU GRID */}
            <View style={styles.grid}>
                <MenuCard
                    title="Akun"
                    icon="person"
                    color="#6366F1"
                    onPress={() => router.push('/Akun')}
                />
                <MenuCard
                    title="Edukasi"
                    icon="school"
                    color="#10B981"
                    onPress={() => router.push('/Edukasi')}
                />
                <MenuCard
                    title="Pemasukan"
                    icon="arrow-down-circle"
                    color="#22C55E"
                    onPress={() => router.push('/Pemasukan')}
                />
                <MenuCard
                    title="Pengeluaran"
                    icon="arrow-up-circle"
                    color="#EF4444"
                    onPress={() => router.push('/Pengeluaran')}
                />
                <MenuCard
                    title="Tabungan"
                    icon="wallet"
                    color="#F59E0B"
                    onPress={() => router.push('/Tabungan')}
                />
                <MenuCard
                    title="Laporan"
                    icon="bar-chart"
                    color="#3B82F6"
                    onPress={() => router.push('/Laporan')}
                />
            </View>
        </ScrollView>
    );
}

/* ================= CARD COMPONENT ================= */
function MenuCard({
    title,
    icon,
    color,
    onPress,
}: {
    title: string;
    icon: any;
    color: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: color }]}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <Ionicons name={icon} size={36} color="#fff" />
            <Text style={styles.cardText}>{title}</Text>
        </TouchableOpacity>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        marginTop: 32,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        height: 130,
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        justifyContent: 'space-between',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
