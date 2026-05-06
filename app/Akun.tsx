import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type User = {
    username: string;
    password: string;
    profileImage?: string;
};

export default function Akun() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // State sementara untuk diedit
    const [tempUsername, setTempUsername] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [tempImage, setTempImage] = useState<string | null>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const currentUserKey = await AsyncStorage.getItem('@currentUser');
        const usersJSON = await AsyncStorage.getItem('@users');

        if (!currentUserKey || !usersJSON) return;

        const users = JSON.parse(usersJSON);
        const userData = users[currentUserKey];

        setUser(userData);
        setTempUsername(userData.username);
        setTempPassword(userData.password);
        setTempImage(userData.profileImage || null);
    };

    const pickImage = async () => {
        if (!isEditing) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setTempImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleSave = async () => {
        try {
            const usersJSON = await AsyncStorage.getItem('@users');
            const currentUserKey = await AsyncStorage.getItem('@currentUser');

            if (usersJSON && currentUserKey) {
                let users = JSON.parse(usersJSON);

                const updatedUser = {
                    ...users[currentUserKey],
                    username: tempUsername,
                    password: tempPassword,
                    profileImage: tempImage
                };

                if (tempUsername !== currentUserKey) {
                    delete users[currentUserKey];
                    users[tempUsername] = updatedUser;
                    await AsyncStorage.setItem('@currentUser', tempUsername);
                } else {
                    users[currentUserKey] = updatedUser;
                }

                await AsyncStorage.setItem('@users', JSON.stringify(users));
                setUser(updatedUser);
                setIsEditing(false);
                Alert.alert('Berhasil', 'Profil Anda telah diperbarui.');
            }
        } catch (e) {
            Alert.alert('Error', 'Gagal menyimpan perubahan.');
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('@currentUser');
        router.replace('/');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.centerContent}>
            <View style={styles.innerContainer}>

                {/* ===== HEADER & FOTO ===== */}
                <View style={styles.headerCard}>
                    <TouchableOpacity onPress={pickImage} activeOpacity={isEditing ? 0.7 : 1}>
                        <View style={styles.avatarWrapper}>
                            {tempImage ? (
                                <Image source={{ uri: tempImage }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                    <Ionicons name="person" size={50} color="#94A3B8" />
                                </View>
                            )}
                            {isEditing && (
                                <View style={styles.cameraBadge}>
                                    <Ionicons name="camera" size={16} color="#FFF" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.profileName}>{user?.username}</Text>
                    {isEditing && <Text style={styles.hintText}>Ketuk foto untuk mengganti</Text>}
                </View>

                {/* ===== FORM EDIT ===== */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Pengaturan Profil</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={tempUsername}
                            onChangeText={setTempUsername}
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={tempPassword}
                            onChangeText={setTempPassword}
                            secureTextEntry
                            editable={isEditing}
                        />
                    </View>

                    {!isEditing ? (
                        <TouchableOpacity style={styles.btnEdit} onPress={() => setIsEditing(true)}>
                            <Ionicons name="create-outline" size={18} color="#FFF" style={{ marginRight: 5 }} />
                            <Text style={styles.btnText}>Edit Profil</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.btnCancel} onPress={() => { setIsEditing(false); loadUser(); }}>
                                <Text style={styles.btnText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                                <Text style={styles.btnText}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* ===== NAVIGASI & LOGOUT ===== */}
                <View style={styles.navSection}>
                    {/* BUTTON KEMBALI KE BERANDA (HOME.TSX) */}
                    <TouchableOpacity
                        style={styles.btnHome}
                        onPress={() => router.replace('/Home')}
                    >
                        <Ionicons name="home" size={20} color="#0891B2" style={{ marginRight: 10 }} />
                        <Text style={styles.btnHomeText}>Kembali ke Beranda</Text>
                    </TouchableOpacity>

                    {/* BUTTON LOGOUT */}
                    <TouchableOpacity style={styles.btnLogout} onPress={logout}>
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 10 }} />
                        <Text style={styles.btnLogoutText}>Keluar Akun</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    centerContent: { alignItems: 'center', paddingBottom: 50 },
    innerContainer: { width: '100%', maxWidth: 450, padding: 20 },

    headerCard: { alignItems: 'center', marginVertical: 20 },
    avatarWrapper: { position: 'relative', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
    avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#FFF' },
    avatarPlaceholder: { backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
    cameraBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#0891B2', padding: 6, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
    profileName: { fontSize: 22, fontWeight: 'bold', marginTop: 10, color: '#1E293B' },
    hintText: { fontSize: 12, color: '#0891B2', marginTop: 5 },

    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#475569', marginBottom: 20 },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 13, color: '#64748B', marginBottom: 6, fontWeight: '600' },
    input: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 14, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' },
    disabledInput: { color: '#94A3B8', opacity: 0.7 },

    row: { flexDirection: 'row', gap: 10, marginTop: 10 },
    btnEdit: { backgroundColor: '#0891B2', padding: 15, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
    btnSave: { flex: 1, backgroundColor: '#10B981', padding: 15, borderRadius: 12, alignItems: 'center' },
    btnCancel: { flex: 1, backgroundColor: '#EF4444', padding: 15, borderRadius: 12, alignItems: 'center' },
    btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

    navSection: { marginTop: 25, gap: 12 },
    btnHome: {
        backgroundColor: '#ECFEFF',
        padding: 16,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0891B2'
    },
    btnHomeText: { color: '#0891B2', fontWeight: 'bold', fontSize: 15 },

    btnLogout: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FEE2E2'
    },
    btnLogoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 },
});