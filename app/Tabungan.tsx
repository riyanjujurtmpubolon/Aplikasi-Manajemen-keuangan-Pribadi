import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const STORAGE_TABUNGAN = '@tabungan_data';
const STORAGE_SALDO = '@tabungan_saldo';

const KATEGORI = [
    'Tabungan Harian',
    'Tabungan Bulanan',
    'Dana Darurat',
    'Pendidikan',
    'Lainnya',
];

type TabunganItem = {
    id: string;
    jumlah: number;
    kategori: string;
    keterangan: string;
    tanggal: string;
};

export default function Tabungan() {
    const [jumlah, setJumlah] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [kategori, setKategori] = useState(KATEGORI[0]);
    const [tanggal, setTanggal] = useState(new Date());
    const [showDate, setShowDate] = useState(false);

    const [data, setData] = useState<TabunganItem[]>([]);
    const [saldo, setSaldo] = useState(0);

    /* ================= LOAD TIAP SCREEN AKTIF ================= */
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        const jsonData = await AsyncStorage.getItem(STORAGE_TABUNGAN);
        const jsonSaldo = await AsyncStorage.getItem(STORAGE_SALDO);

        setData(jsonData ? JSON.parse(jsonData) : []);
        setSaldo(jsonSaldo ? Number(jsonSaldo) : 0);
    };

    /* ================= SIMPAN ================= */
    const handleSimpan = async () => {
        if (!jumlah || Number(jumlah) <= 0) {
            Alert.alert('Error', 'Jumlah tidak valid');
            return;
        }

        const newItem: TabunganItem = {
            id: `${Date.now()}-${Math.random()}`, // 🔥 ID UNIK
            jumlah: Number(jumlah),
            kategori,
            keterangan,
            tanggal: tanggal.toISOString(),
        };

        const newData = [newItem, ...data];
        const newSaldo = saldo + Number(jumlah);

        await AsyncStorage.setItem(STORAGE_TABUNGAN, JSON.stringify(newData));
        await AsyncStorage.setItem(STORAGE_SALDO, newSaldo.toString());

        setData(newData);
        setSaldo(newSaldo);
        setJumlah('');
        setKeterangan('');
    };

    /* ================= HAPUS ================= */
    const handleHapus = async (id: string, nominal: number) => {
        const filtered = data.filter(item => item.id !== id);
        const newSaldo = saldo - nominal;

        await AsyncStorage.setItem(STORAGE_TABUNGAN, JSON.stringify(filtered));
        await AsyncStorage.setItem(STORAGE_SALDO, newSaldo.toString());

        setData([...filtered]); // 🔥 FORCE RENDER
        setSaldo(newSaldo);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.back}>← Kembali</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Tabungan</Text>

            <Text style={styles.saldo}>
                Saldo: Rp {saldo.toLocaleString('id-ID')}
            </Text>

            <TextInput
                placeholder="Jumlah"
                keyboardType="numeric"
                value={jumlah}
                onChangeText={setJumlah}
                style={styles.input}
            />

            <View style={styles.picker}>
                <Picker selectedValue={kategori} onValueChange={setKategori}>
                    {KATEGORI.map(k => (
                        <Picker.Item key={k} label={k} value={k} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity onPress={() => setShowDate(true)} style={styles.input}>
                <Text>{tanggal.toLocaleDateString('id-ID')}</Text>
            </TouchableOpacity>

            {showDate && (
                <DateTimePicker
                    value={tanggal}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, d) => {
                        setShowDate(false);
                        if (d) setTanggal(d);
                    }}
                />
            )}

            <TextInput
                placeholder="Keterangan"
                value={keterangan}
                onChangeText={setKeterangan}
                style={styles.input}
            />

            <TouchableOpacity style={styles.btn} onPress={handleSimpan}>
                <Text style={styles.btnText}>Simpan</Text>
            </TouchableOpacity>

            <FlatList
                data={data}
                keyExtractor={item => item.id}
                extraData={data} // 🔥
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.amount}>
                                + Rp {item.jumlah.toLocaleString('id-ID')}
                            </Text>
                            <Text>{item.kategori}</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => handleHapus(item.id, item.jumlah)}
                        >
                            <Text style={styles.hapus}>Hapus</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    back: { color: '#2563EB', marginTop: 32, },
    title: { fontSize: 24, fontWeight: 'bold', marginTop: 12, },
    saldo: { marginVertical: 10, fontSize: 18 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 },
    picker: { borderWidth: 1, marginBottom: 10 },
    btn: { backgroundColor: '#22C55E', padding: 12, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold' },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amount: { fontWeight: 'bold', color: '#16A34A' },
    hapus: { color: '#DC2626', fontWeight: 'bold' },
});
