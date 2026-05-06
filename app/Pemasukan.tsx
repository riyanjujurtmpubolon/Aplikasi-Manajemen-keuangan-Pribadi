import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const STORAGE_KEY = '@pemasukan';
const KATEGORI = ['Gaji', 'Pinjaman', 'Bonus', 'Hadiah', 'Lainnya'];

type Item = {
    id: string;
    jumlah: string;
    keterangan: string;
    kategori: string;
    tanggal: string;
};

export default function Pemasukan() {
    const [jumlah, setJumlah] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [kategori, setKategori] = useState(KATEGORI[0]);
    const [tanggal, setTanggal] = useState(new Date());
    const [showDate, setShowDate] = useState(false);

    const [data, setData] = useState<Item[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [selectedKategori, setSelectedKategori] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setData(JSON.parse(json));
    };

    const handleSimpan = async () => {
        if (!jumlah || !keterangan) {
            Alert.alert('Peringatan', 'Semua field wajib diisi');
            return;
        }

        let newData: Item[];
        if (editId) {
            newData = data.map(item =>
                item.id === editId
                    ? { ...item, jumlah, keterangan, kategori, tanggal: tanggal.toISOString() }
                    : item
            );
        } else {
            const newItem = {
                id: Date.now().toString(),
                jumlah,
                keterangan,
                kategori,
                tanggal: tanggal.toISOString(),
            };
            newData = [newItem, ...data];
        }

        setData([...newData]); // Menggunakan spread agar referensi array baru
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        resetForm();
    };

    /* ================= FUNGSI HAPUS YANG SUDAH DIPERBAIKI ================= */
    const handleHapus = async (idYangDihapus: string) => {
        Alert.alert('Hapus Data', 'Yakin ingin menghapus data ini?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Hapus',
                style: 'destructive',
                onPress: async () => {
                    // 1. Filter data: ambil semua KECUALI yang ID-nya dipilih
                    const dataSisa = data.filter(item => item.id !== idYangDihapus);

                    // 2. Update state dengan array baru (PENTING: gunakan spread [...])
                    setData([...dataSisa]);

                    // 3. Update storage
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataSisa));

                    // 4. Jika sedang dalam mode edit item tersebut, batalkan edit
                    if (editId === idYangDihapus) {
                        resetForm();
                    }
                },
            },
        ]);
    };

    const resetForm = () => {
        setJumlah('');
        setKeterangan('');
        setKategori(KATEGORI[0]);
        setTanggal(new Date());
        setEditId(null);
    };

    const renderData = selectedKategori
        ? data.filter(item => item.kategori === selectedKategori)
        : data;

    return (
        <View style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
            {/* NAVBAR */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.navBack}>← Kembali</Text>
                </TouchableOpacity>
                <Text style={styles.navTitle}>Pemasukan</Text>
                <View style={{ width: 60 }} />
            </View>

            <View style={styles.container}>
                {/* FORM */}
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={jumlah}
                        onChangeText={setJumlah}
                        placeholder="Jumlah"
                    />
                    <View style={styles.picker}>
                        <Picker selectedValue={kategori} onValueChange={setKategori}>
                            {KATEGORI.map(k => <Picker.Item key={k} label={k} value={k} />)}
                        </Picker>
                    </View>
                    <TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
                        <Text>{tanggal.toLocaleDateString('id-ID')}</Text>
                    </TouchableOpacity>

                    {showDate && (
                        <DateTimePicker
                            value={tanggal}
                            mode="date"
                            display="default"
                            onChange={(_, d) => {
                                setShowDate(false);
                                if (d) setTanggal(d);
                            }}
                        />
                    )}

                    <TextInput
                        style={styles.input}
                        value={keterangan}
                        onChangeText={setKeterangan}
                        placeholder="Keterangan"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSimpan}>
                        <Text style={styles.buttonText}>{editId ? 'UPDATE' : 'SIMPAN'}</Text>
                    </TouchableOpacity>
                </View>

                {/* FILTER */}
                <View style={styles.categoryList}>
                    <TouchableOpacity
                        style={[styles.categoryItem, !selectedKategori && styles.categoryActive]}
                        onPress={() => setSelectedKategori(null)}
                    >
                        <Text>Semua</Text>
                    </TouchableOpacity>
                    {KATEGORI.map(k => (
                        <TouchableOpacity
                            key={k}
                            style={[styles.categoryItem, selectedKategori === k && styles.categoryActive]}
                            onPress={() => setSelectedKategori(k)}
                        >
                            <Text>{k}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* LIST - Pastikan menggunakan 'data' sebagai extraData */}
                <FlatList
                    data={renderData}
                    keyExtractor={(item) => item.id}
                    extraData={data}
                    renderItem={({ item }) => (
                        <View style={styles.tableRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.amount}>+ Rp {item.jumlah}</Text>
                                <Text style={{ fontSize: 12, color: '#666' }}>
                                    {item.kategori}
                                </Text>
                                <Text>{item.keterangan}</Text>
                            </View>

                            <View style={{ alignItems: 'flex-end' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setJumlah(item.jumlah);
                                        setKeterangan(item.keterangan);
                                        setKategori(item.kategori);
                                        setTanggal(new Date(item.tanggal));
                                        setEditId(item.id);
                                    }}
                                >
                                    <Text style={styles.editText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleHapus(item.id)}
                                >
                                    <Text style={styles.deleteText}>Hapus</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: { height: 82, backgroundColor: '#16A34A', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
    navBack: { color: '#fff', fontWeight: '600', marginTop: 32 },
    navTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 32 },
    container: { flex: 1, padding: 20 },
    form: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, marginBottom: 12 },
    picker: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, marginBottom: 12, overflow: 'hidden' },
    button: { backgroundColor: '#22C55E', padding: 14, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    categoryList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
    categoryItem: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#E5E7EB' },
    categoryActive: { backgroundColor: '#16A34A' },
    tableRow: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    amount: { fontWeight: 'bold', color: '#16A34A', fontSize: 16 },
    editText: { color: '#2563EB', fontWeight: '600', marginBottom: 10 },
    deleteText: { color: '#DC2626', fontWeight: '600' },
});