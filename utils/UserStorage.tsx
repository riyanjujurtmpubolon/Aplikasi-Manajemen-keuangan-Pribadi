import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

/* ===== ambil semua user (UMUM) ===== */
export const getAllUsers = async () => {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};


/* ===== register (tambah ke users) ===== */
export const registerUser = async (
    username: string,
    email: string,
    password: string
) => {
    const users = await getAllUsers();

    const exist = users.find((u: any) => u.email === email);
    if (exist) {
        throw new Error('Email sudah terdaftar');
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        photo: null,
    };

    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

    // set user aktif
    await AsyncStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(newUser)
    );

    return newUser;
};

/* ===== login ===== */
export const loginUser = async (
    email: string,
    password: string
) => {
    const users = await getAllUsers();

    const user = users.find(
        (u: any) => u.email === email && u.password === password
    );

    if (!user) {
        throw new Error('Email atau password salah');
    }

    await AsyncStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );

    return user;
};

/* ===== user aktif ===== */
export const getCurrentUser = async () => {
    const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
};

/* ===== logout ===== */
export const logoutUser = async () => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
};
