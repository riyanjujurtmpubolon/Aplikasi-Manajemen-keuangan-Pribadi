import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/* ===== STORAGE KEY (HARUS SAMA) ===== */
const STORAGE_PEMASUKAN = '@pemasukan';
const STORAGE_PENGELUARAN = '@pengeluaran';
const STORAGE_TABUNGAN = '@tabungan_data';
const STORAGE_SALDO_TABUNGAN = '@tabungan_saldo';

export default function Laporan() {
    const [totalPemasukan, setTotalPemasukan] = useState(0);
    const [totalPengeluaran, setTotalPengeluaran] = useState(0);
    const [saldoAkhir, setSaldoAkhir] = useState(0);
    const [totalTabungan, setTotalTabungan] = useState(0);

    useEffect(() => {
        loadLaporan();
    }, []);

    const loadLaporan = async () => {
        const pemasukanJson = await AsyncStorage.getItem(STORAGE_PEMASUKAN);
        const pengeluaranJson = await AsyncStorage.getItem(STORAGE_PENGELUARAN);
        const saldoTabunganJson = await AsyncStorage.getItem(STORAGE_SALDO_TABUNGAN);

        /* ===== PEMASUKAN ===== */
        if (pemasukanJson) {
            const pemasukan = JSON.parse(pemasukanJson);
            setTotalPemasukan(
                pemasukan.reduce(
                    (sum: number, item: any) => sum + Number(item.jumlah),
                    0
                )
            );
        }

        /* ===== PENGELUARAN ===== */
        if (pengeluaranJson) {
            const pengeluaran = JSON.parse(pengeluaranJson);
            setTotalPengeluaran(
                pengeluaran.reduce(
                    (sum: number, item: any) => sum + Number(item.jumlah),
                    0
                )
            );
        }

        /* ===== TABUNGAN ===== */
        if (saldoTabunganJson) {
            setTotalTabungan(Number(saldoTabunganJson));
        }

        /* ===== SALDO AKHIR ===== */
        if (pemasukanJson && pengeluaranJson) {
            const pemasukan = JSON.parse(pemasukanJson);
            const pengeluaran = JSON.parse(pengeluaranJson);

            const totalMasuk = pemasukan.reduce(
                (sum: number, item: any) => sum + Number(item.jumlah),
                0
            );
            const totalKeluar = pengeluaran.reduce(
                (sum: number, item: any) => sum + Number(item.jumlah),
                0
            );

            setSaldoAkhir(totalMasuk - totalKeluar);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* ===== BUTTON KEMBALI ===== */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.backText}>← Kembali</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Laporan Keuangan</Text>

            {/* ===== PEMASUKAN ===== */}
            <View style={[styles.card, styles.income]}>
                <Text style={styles.label}>Total Pemasukan</Text>
                <Text style={styles.value}>
                    Rp {totalPemasukan.toLocaleString('id-ID')}
                </Text>
            </View>

            {/* ===== PENGELUARAN ===== */}
            <View style={[styles.card, styles.expense]}>
                <Text style={styles.label}>Total Pengeluaran</Text>
                <Text style={styles.value}>
                    Rp {totalPengeluaran.toLocaleString('id-ID')}
                </Text>
            </View>

            {/* ===== SALDO AKHIR ===== */}
            <View style={[styles.card, styles.balance]}>
                <Text style={styles.label}>Saldo Akhir</Text>
                <Text style={styles.value}>
                    Rp {saldoAkhir.toLocaleString('id-ID')}
                </Text>
            </View>

            {/* ===== TABUNGAN ===== */}
            <View style={[styles.card, styles.saving]}>
                <Text style={styles.label}>Total Tabungan</Text>
                <Text style={styles.value}>
                    Rp {totalTabungan.toLocaleString('id-ID')}
                </Text>
            </View>

            {/* ===== CATATAN ===== */}
            <View style={styles.noteCard}>
                <Text style={styles.noteTitle}>Catatan</Text>
                <Text style={styles.noteText}>
                    Laporan ini menampilkan ringkasan keuangan berdasarkan
                    data pemasukan, pengeluaran, dan tabungan yang telah
                    Anda input.
                </Text>
            </View>
        </ScrollView>
    );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: 20,
    },

    backButton: {
        marginBottom: 10,
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2563EB',
        marginTop: 32,
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    card: {
        borderRadius: 18,
        padding: 20,
        marginBottom: 14,
        elevation: 4,
    },
    label: {
        color: '#E5E7EB',
        fontSize: 14,
    },
    value: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 6,
    },

    income: {
        backgroundColor: '#16A34A',
    },
    expense: {
        backgroundColor: '#DC2626',
    },
    balance: {
        backgroundColor: '#2563EB',
    },
    saving: {
        backgroundColor: '#059669',
    },

    noteCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        elevation: 2,
        marginTop: 20,
    },
    noteTitle: {
        fontWeight: 'bold',
        marginBottom: 6,
    },
    noteText: {
        color: '#6B7280',
        lineHeight: 20,
    },
});
