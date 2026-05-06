import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const videos = {
    v1: require('../videos/menabung1.mp4'),
    v2: require('../videos/menabung2.mp4'),
    v3: require('../videos/menabung3.mp4'),
    v5: require('../videos/menabung5.mp4'),
    v6: require('../videos/menabung6.mp4'),
};

export default function Menabung() {
    const [activeVideo, setActiveVideo] = useState(videos.v1);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.centerContent}>
            <View style={styles.innerContainer}>
                {/* ===== TITLE ===== */}
                <Text style={styles.title}>Edukasi Menabung</Text>

                {/* ===== VIDEO CARD ===== */}
                <View style={styles.videoCard}>
                    <Video
                        source={activeVideo}
                        style={styles.video}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN} // Menjaga proporsi video tetap benar
                        shouldPlay={false}
                    />
                </View>

                {/* ===== PILIH VIDEO ===== */}
                <Text style={styles.sectionTitle}>Pilih Video Edukasi</Text>
                <View style={styles.videoList}>
                    <VideoButton title="Menabung Dasar" active={activeVideo === videos.v1} onPress={() => setActiveVideo(videos.v1)} />
                    <VideoButton title="Menabung Harian" active={activeVideo === videos.v2} onPress={() => setActiveVideo(videos.v2)} />
                    <VideoButton title="Tips Konsisten" active={activeVideo === videos.v3} onPress={() => setActiveVideo(videos.v3)} />
                    <VideoButton title="Mengatur Uang Jajan" active={activeVideo === videos.v5} onPress={() => setActiveVideo(videos.v5)} />
                    <VideoButton title="Menabung Masa Depan" active={activeVideo === videos.v6} onPress={() => setActiveVideo(videos.v6)} />
                </View>

                {/* ===== TEXT EDUKASI ===== */}
                <View style={styles.textCard}>
                    <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Tentang Menabung</Text>
                    <Text style={styles.text}>
                        Menabung adalah kebiasaan menyisihkan sebagian uang secara rutin
                        untuk kebutuhan di masa depan.
                    </Text>
                    <Text style={styles.textBold}>Manfaat menabung:</Text>
                    <Text style={styles.textSmall}>• Membentuk kebiasaan hemat</Text>
                    <Text style={styles.textSmall}>• Persiapan kondisi darurat</Text>
                    <Text style={styles.textSmall}>• Mewujudkan tujuan masa depan</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    centerContent: {
        alignItems: 'center', // Penting agar konten tidak melebar liar di PC/Web
        paddingBottom: 40,
    },
    innerContainer: {
        width: '100%',
        maxWidth: 600, // Membatasi lebar agar tetap terlihat seperti HP di layar PC
        padding: 20,
    },
    title: {
        marginTop: 32,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#111827',
    },
    videoCard: {
        width: '100%',
        aspectRatio: 16 / 9, // Mengunci kotak hitam pada rasio 16:9
        backgroundColor: '#000',
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 5,
        justifyContent: 'center', // Memastikan video di tengah kotak
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%', // Memastikan komponen video mengisi seluruh VideoCard
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#374151',
    },
    videoList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    videoItem: {
        backgroundColor: '#E0E7FF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    videoItemActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4338CA',
    },
    videoText: {
        color: '#4338CA',
        fontSize: 13,
        fontWeight: '600',
    },
    videoTextActive: {
        color: '#FFF',
    },
    textCard: {
        backgroundColor: '#FFF',
        padding: 18,
        borderRadius: 15,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
        marginBottom: 10,
    },
    textBold: {
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 5,
    },
    textSmall: {
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 5,
    },
    backButton: {
        backgroundColor: '#4F46E5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 32,
    },
    backButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});