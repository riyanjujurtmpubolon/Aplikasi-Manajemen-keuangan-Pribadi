import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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

const STORAGE_KEY = '@pengeluaran';

const KATEGORI = [
    'Makan',
    'Transportasi',
    'Belanja',
    'Hiburan',
    'Pendidikan',
    'Lainnya',
];

export default function Pengeluaran() {
    const [jumlah, setJumlah] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [kategori, setKategori] = useState(KATEGORI[0]);
    const [tanggal, setTanggal] = useState(new Date());
    const [showDate, setShowDate] = useState(false);

    const [data, setData] = useState<any[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [selectedKategori, setSelectedKategori] = useState<string | null>(
        null
    );

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setData(JSON.parse(json));
    };

    /* ===== SIMPAN / UPDATE ===== */
    const handleSimpan = async () => {
        if (!jumlah || !keterangan) {
            Alert.alert('Peringatan', 'Semua field wajib diisi');
            return;
        }

        let newData = [...data];

        if (editId) {
            newData = newData.map(item =>
                item.id === editId
                    ? {
                        ...item,
                        jumlah,
                        keterangan,
                        kategori,
                        tanggal: tanggal.toISOString(),
                    }
                    : item
            );
        } else {
            newData.unshift({
                id: Date.now().toString(),
                jumlah,
                keterangan,
                kategori,
                tanggal: tanggal.toISOString(),
            });
        }

        setData(newData);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        resetForm();
    };

    /* ===== EDIT ===== */
    const handleEdit = (item: any) => {
        setJumlah(item.jumlah);
        setKeterangan(item.keterangan);
        setKategori(item.kategori);
        setTanggal(new Date(item.tanggal));
        setEditId(item.id);
    };

    /* ===== HAPUS ===== */
    const handleHapus = (id: string) => {
        Alert.alert('Hapus Data', 'Yakin ingin menghapus data ini?', [
            { text: 'Batal' },
            {
                text: 'Hapus',
                style: 'destructive',
                onPress: async () => {
                    const newData = data.filter(item => item.id !== id);
                    setData(newData);
                    await AsyncStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(newData)
                    );
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

    const formatTanggal = (date: string) =>
        new Date(date).toLocaleDateString('id-ID');

    const filteredData = selectedKategori
        ? data.filter(item => item.kategori === selectedKategori)
        : [];

    return (
        <View style={{ flex: 1 }}>
            {/* ===== NAVBAR ===== */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.navBack}>← Kembali</Text>
                </TouchableOpacity>

                <Text style={styles.navTitle}>Pengeluaran</Text>

                <View style={{ width: 60 }} />
            </View>

            {/* ===== CONTENT ===== */}
            <View style={styles.container}>
                {/* ===== FORM ===== */}
                <View style={styles.form}>
                    <Text style={styles.label}>Jumlah</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={jumlah}
                        onChangeText={setJumlah}
                        placeholder="Rp"
                    />

                    <Text style={styles.label}>Kategori</Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={kategori}
                            onValueChange={setKategori}
                        >
                            {KATEGORI.map(k => (
                                <Picker.Item
                                    key={k}
                                    label={k}
                                    value={k}
                                />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Tanggal</Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDate(true)}
                    >
                        <Text>
                            {tanggal.toLocaleDateString('id-ID')}
                        </Text>
                    </TouchableOpacity>

                    {showDate && (
                        <DateTimePicker
                            value={tanggal}
                            mode="date"
                            display={
                                Platform.OS === 'ios'
                                    ? 'spinner'
                                    : 'default'
                            }
                            onChange={(_, d) => {
                                setShowDate(false);
                                if (d) setTanggal(d);
                            }}
                        />
                    )}

                    <Text style={styles.label}>Keterangan</Text>
                    <TextInput
                        style={styles.input}
                        value={keterangan}
                        onChangeText={setKeterangan}
                        placeholder="Contoh: Makan siang"
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSimpan}
                    >
                        <Text style={styles.buttonText}>
                            {editId ? 'Update' : 'Simpan'}
                        </Text>
                    </TouchableOpacity>

                    {editId && (
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={resetForm}
                        >
                            <Text style={styles.cancelText}>
                                Batal Edit
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* ===== PILIH KATEGORI ===== */}
                <Text style={styles.sectionTitle}>Pilih Kategori</Text>

                <View style={styles.categoryList}>
                    {KATEGORI.map(k => (
                        <TouchableOpacity
                            key={k}
                            style={[
                                styles.categoryItem,
                                selectedKategori === k &&
                                styles.categoryActive,
                            ]}
                            onPress={() => setSelectedKategori(k)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedKategori === k && {
                                        color: '#fff',
                                    },
                                ]}
                            >
                                {k}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ===== LIST DATA ===== */}
                {selectedKategori && (
                    <FlatList
                        data={filteredData}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.tableRow}>
                                <View>
                                    <Text style={styles.amount}>
                                        - Rp {item.jumlah}
                                    </Text>
                                    <Text>{item.keterangan}</Text>
                                    <Text style={styles.date}>
                                        {formatTanggal(item.tanggal)}
                                    </Text>
                                </View>

                                <View>
                                    <TouchableOpacity
                                        onPress={() => handleEdit(item)}
                                    >
                                        <Text style={styles.editText}>
                                            Edit
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() =>
                                            handleHapus(item.id)
                                        }
                                    >
                                        <Text style={styles.deleteText}>
                                            Hapus
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
    navbar: {
        height: 82,
        backgroundColor: '#991B1B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        elevation: 4,
    },
    navBack: {
        marginTop: 32,
        color: '#fff',
        fontWeight: '600',
    },
    navTitle: {
        marginTop: 32,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: '#FEF2F2',
        padding: 20,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    label: {
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        marginBottom: 12,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: '#DC2626',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    cancelText: {
        color: '#6B7280',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
    },
    categoryItem: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
    },
    categoryActive: {
        backgroundColor: '#991B1B',
    },
    categoryText: {
        fontWeight: '600',
    },
    tableRow: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amount: {
        fontWeight: 'bold',
        color: '#DC2626',
    },
    date: {
        fontSize: 12,
        color: '#6B7280',
    },
    editText: {
        color: '#2563EB',
        fontWeight: '600',
    },
    deleteText: {
        color: '#DC2626',
        fontWeight: '600',
    },
});
