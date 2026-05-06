import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!username || !password) {
            alert('Username dan password wajib diisi');
            return;
        }

        // Ambil semua user
        const usersJSON = await AsyncStorage.getItem('@users');
        const users = usersJSON ? JSON.parse(usersJSON) : {};

        // Cek username
        if (users[username]) {
            alert('Username sudah terdaftar');
            return;
        }

        // Simpan user baru
        users[username] = {
            username,
            password,
        };

        await AsyncStorage.setItem('@users', JSON.stringify(users));

        alert('Registrasi berhasil, silakan login');

        // ⬅️ KEMBALI KE HALAMAN LOGIN
        router.replace('/');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Text style={styles.title}>ManJu</Text>

            <View style={styles.container}>
                <View style={styles.card}>
                    <Image
                        source={require('../assets/images/finance.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />

                    <Text style={styles.subtitle}>
                        Buat akun untuk mulai mengelola keuanganmu
                    </Text>

                    <TextInput
                        placeholder="Username"
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <TextInput
                        placeholder="Password"
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegister}
                    >
                        <Text style={styles.registerButtonText}>Daftar</Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Sudah punya akun?</Text>
                        <TouchableOpacity onPress={() => router.replace('/')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 34,
        color: '#2563EB',
        textAlign: 'right',
        paddingRight: 24,
        marginTop: 14,
        marginBottom: 14,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        elevation: 8,
    },
    image: {
        width: '100%',
        height: 180,
        marginBottom: 10,
    },
    subtitle: {
        textAlign: 'center',
        color: '#64748B',
        marginBottom: 22,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
    },
    registerButton: {
        backgroundColor: '#16A34A',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 18,
    },
    loginText: {
        color: '#6B7280',
        marginRight: 6,
    },
    loginLink: {
        color: '#2563EB',
        fontWeight: 'bold',
    },
});
