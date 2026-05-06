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

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // VALIDASI INPUT KOSONG
    if (!username || !password) {
      alert('Username dan password wajib diisi');
      return; // TETAP DI HALAMAN LOGIN
    }

    // AMBIL DATA USER DARI REGISTER
    const usersJSON = await AsyncStorage.getItem('@users');

    if (!usersJSON) {
      alert('Belum ada akun terdaftar');
      return;
    }

    const users = JSON.parse(usersJSON);
    const user = users[username];

    // VALIDASI USER TIDAK ADA ATAU PASSWORD SALAH
    if (!user) {
      alert('Username tidak terdaftar');
      return;
    }

    if (user.password !== password) {
      alert('Password salah');
      return;
    }

    // LOGIN BERHASIL
    await AsyncStorage.setItem('@currentUser', username);
    router.replace('/Home');
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
            Kelola keuanganmu dengan cerdas
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
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Belum punya akun?</Text>
            <TouchableOpacity onPress={() => router.push('/Register')}>
              <Text style={styles.registerLink}>Daftar Sekarang</Text>
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
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  registerText: {
    color: '#6B7280',
    marginRight: 6,
  },
  registerLink: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
});
