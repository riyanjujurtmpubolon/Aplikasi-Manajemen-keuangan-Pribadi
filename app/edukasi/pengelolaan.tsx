import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/* ===== VIDEO ASSETS ===== */
const videos = {
    v1: require('../videos/pengelolaan1.mp4'),
    v2: require('../videos/pengelolaan2.mp4'),
    v3: require('../videos/pengelolaan3.mp4'),
    v4: require('../videos/pengelolaan4.mp4'),
    v5: require('../videos/pengelolaan5.mp4'),
};

export default function Pengelolaan() {
    const [activeVideo, setActiveVideo] = useState(videos.v1);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.centerContent}
        >
            <View style={styles.innerContainer}>

                {/* ===== TITLE ===== */}
                <Text style={styles.title}>Edukasi Pengelolaan Keuangan</Text>

                {/* ===== VIDEO CARD ===== */}
                <View style={styles.videoCard}>
                    <Video
                        source={activeVideo}
                        style={styles.video}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay={false}
                    />
                </View>

                {/* ===== PILIH VIDEO ===== */}
                <Text style={styles.sectionTitle}>Materi Video</Text>

                <View style={styles.videoList}>
                    <VideoButton
                        title="Dasar Pengelolaan"
                        active={activeVideo === videos.v1}
                        onPress={() => setActiveVideo(videos.v1)}
                    />
                    <VideoButton
                        title="Mengatur Pengeluaran"
                        active={activeVideo === videos.v2}
                        onPress={() => setActiveVideo(videos.v2)}
                    />
                    <VideoButton
                        title="Menghindari Pemborosan"
                        active={activeVideo === videos.v3}
                        onPress={() => setActiveVideo(videos.v3)}
                    />
                    <VideoButton
                        title="Investasi Pemula"
                        active={activeVideo === videos.v4}
                        onPress={() => setActiveVideo(videos.v4)}
                    />
                    <VideoButton
                        title="Dana Darurat"
                        active={activeVideo === videos.v5}
                        onPress={() => setActiveVideo(videos.v5)}
                    />
                </View>

                {/* ===== TEXT EDUKASI ===== */}
                <View style={styles.textCard}>
                    <Text style={[styles.sectionTitle, { color: '#0E7490' }]}>Apa itu Pengelolaan Keuangan?</Text>

                    <Text style={styles.text}>
                        Pengelolaan keuangan adalah cara mengatur pemasukan dan pengeluaran
                        agar keuangan tetap stabil dan tujuan finansial tercapai.
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.subtitle}>Langkah pengelolaan keuangan:</Text>
                    <Text style={styles.textList}>• Mencatat pemasukan secara detail</Text>
                    <Text style={styles.textList}>• Mengontrol pengeluaran harian</Text>
                    <Text style={styles.textList}>• Membuat anggaran bulanan</Text>
                    <Text style={styles.textList}>• Menyiapkan dana darurat</Text>
                    <Text style={styles.textList}>• Menabung secara konsisten</Text>
                </View>

                {/* ===== BUTTON KEMBALI ===== */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace('/Edukasi')}
                >
                    <Text style={styles.backButtonText}>⬅ Kembali ke Edukasi</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

/* ===== VIDEO BUTTON COMPONENT ===== */
function VideoButton({ title, onPress, active }: any) {
    return (
        <TouchableOpacity
            style={[styles.videoItem, active && styles.videoItemActive]}
            onPress={onPress}
        >
            <Text style={[styles.videoText, active && styles.videoTextActive]}>{title}</Text>
        </TouchableOpacity>
    );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    centerContent: {
        alignItems: 'center', // Menjaga konten di tengah layar
        paddingBottom: 40,
    },
    innerContainer: {
        width: '100%',
        maxWidth: 600, // Membatasi lebar agar tidak melar di browser PC
        padding: 20,
    },
    title: {
        marginTop: 32,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#111827',
    },

    /* ===== VIDEO ===== */
    videoCard: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 25,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    video: {
        width: '100%',
        height: '100%',
    },

    /* ===== LIST ===== */
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#1F2937',
    },
    videoList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 25,
    },
    videoItem: {
        backgroundColor: '#ECFEFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CFFAFE',
    },
    videoItemActive: {
        backgroundColor: '#0891B2',
        borderColor: '#0891B2',
    },
    videoText: {
        color: '#0369A1',
        fontWeight: '600',
        fontSize: 13,
    },
    videoTextActive: {
        color: '#FFFFFF',
    },

    /* ===== CARD TEXT ===== */
    textCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        lineHeight: 22,
        color: '#4B5563',
    },
    textList: {
        fontSize: 14,
        lineHeight: 24,
        color: '#4B5563',
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 15,
    },

    /* ===== BUTTON KEMBALI ===== */
    backButton: {
        backgroundColor: '#0891B2',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});