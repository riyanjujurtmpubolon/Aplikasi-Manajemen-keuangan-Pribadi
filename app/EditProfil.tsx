import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditProfil() {
    const [username, setUsername] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadUser();
    }, []);

    /* ================= LOAD USER ================= */
    const loadUser = async () => {
        const data = await AsyncStorage.getItem('currentUser');
        if (!data) return;

        const parsed = JSON.parse(data);
        setUser(parsed);
        setUsername(parsed.username || '');
        setPhoto(parsed.photo || null);
    };

    /* ================= PICK IMAGE ================= */
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    /* ================= HAPUS FOTO (PASTI KERJA) ================= */
    const handleDeletePhoto = async () => {
        if (!user) return;

        Alert.alert(
            'Hapus Foto Profil',
            'Yakin ingin menghapus foto profil?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        const usersData = await AsyncStorage.getItem('users');
                        if (!usersData) return;

                        const users = JSON.parse(usersData);

                        const updatedUsers = users.map((u: any) =>
                            u.id === user.id ? { ...u, photo: null } : u
                        );

                        const updatedUser = { ...user, photo: null };

                        await AsyncStorage.setItem(
                            'users',
                            JSON.stringify(updatedUsers)
                        );
                        await AsyncStorage.setItem(
                            'currentUser',
                            JSON.stringify(updatedUser)
                        );

                        setPhoto(null);
                        setUser(updatedUser);

                        Alert.alert('Sukses', 'Foto profil berhasil dihapus');
                    },
                },
            ]
        );
    };

    /* ================= SAVE ================= */
    const handleSave = async () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Nama tidak boleh kosong');
            return;
        }

        if (!user) return;

        const usersData = await AsyncStorage.getItem('users');
        if (!usersData) return;

        const users = JSON.parse(usersData);

        const updatedUsers = users.map((u: any) =>
            u.id === user.id
                ? { ...u, username, photo }
                : u
        );

        const updatedUser = { ...user, username, photo };

        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));

        Alert.alert('Berhasil', 'Profil diperbarui');
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profil</Text>

            {/* ===== AVATAR ===== */}
            <View style={styles.avatarBox}>
                <TouchableOpacity onPress={pickImage}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatar}>
                            <Ionicons name="camera" size={36} color="#9CA3AF" />
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={pickImage}>
                    <Text style={styles.changePhoto}>Ganti Foto</Text>
                </TouchableOpacity>

                {/* 🔥 TANPA KONDISI — SELALU ADA */}
                <TouchableOpacity onPress={handleDeletePhoto}>
                    <Text style={styles.removePhoto}>Hapus Foto</Text>
                </TouchableOpacity>
            </View>

            {/* ===== FORM ===== */}
            <View style={styles.card}>
                <Text style={styles.label}>Nama Akun</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>Simpan Perubahan</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    avatarBox: {
        alignItems: 'center',
        marginVertical: 24,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changePhoto: {
        marginTop: 8,
        color: '#4F46E5',
        fontWeight: '600',
    },
    removePhoto: {
        marginTop: 6,
        color: '#EF4444',
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        elevation: 4,
    },
    label: {
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
    },
});
