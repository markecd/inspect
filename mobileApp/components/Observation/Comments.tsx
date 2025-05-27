import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { useEffect, useState } from "react";
import { openDatabase } from "@/services/database";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import { styles } from '../../assets/styles/Observation/comments.styles'
import WaveformAnimation from "./Animation";

type Props = {
    observationId: number;
};

type Comment = {
    id: number;
    tip_komentarja: string;
    vsebina: string;
    cas: string;
    lokacija: string | null;
    tk_opazanje: number;
    pot_glas: string | null;
};

export default function Comments({ observationId }: Props) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [recording, setRecording] = useState<any>(null);

    useEffect(() => {
        fetchComments();
    }, [observationId]);

    const fetchComments = async () => {
        try {
            const db = await openDatabase();
            const result = db.getAllSync<Comment>(
                `SELECT * FROM KOMENTAR WHERE tk_opazanje = ? ORDER BY cas DESC`,
                [observationId]
            );
            setComments(result);
        } catch (error) {
            console.error("Napaka pri nalaganju komentarjev:", error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const db = await openDatabase();
            const now = new Date();
            const cas = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.toLocaleTimeString()}`;
            const location = await Location.getCurrentPositionAsync({});
            const lokacija = `${location.coords.latitude},${location.coords.longitude}`;

            db.runSync(
                `INSERT INTO KOMENTAR (tip_komentarja, vsebina, cas, lokacija, tk_opazanje, pot_glas)
         VALUES (?, ?, ?, ?, ?, ?)`,
                ["tekst", newComment, cas, lokacija, observationId, null]
            );

            setNewComment("");
            fetchComments();
        } catch (error) {
            console.error("Napaka pri dodajanju komentarja:", error);
        }
    };

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error("Napaka pri snemanju:", err);
        }
    };

    const stopRecording = async () => {
        try {
            if (!recording) return;
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            const now = new Date();
            const cas = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.toLocaleTimeString()}`;
            const location = await Location.getCurrentPositionAsync({});
            const lokacija = `${location.coords.latitude},${location.coords.longitude}`;

            const db = await openDatabase();
            db.runSync(
                `INSERT INTO KOMENTAR (tip_komentarja, vsebina, cas, lokacija, tk_opazanje, pot_glas)
         VALUES (?, ?, ?, ?, ?, ?)`,
                ["glas", null, cas, lokacija, observationId, uri]
            );

            fetchComments();
        } catch (err) {
            console.error("Napaka pri končanju snemanja:", err);
        }
    };

    const playSound = async (uri: string) => {
        const { sound } = await Audio.Sound.createAsync({ uri });
        await sound.playAsync();
    };

    const handleDeleteComment = async (id: number) => {
        try {
            const db = await openDatabase();
            db.runSync(`DELETE FROM KOMENTAR WHERE id = ?`, [id]);
            fetchComments();
        } catch (error) {
            console.error("Napaka pri brisanju komentarja:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Komentarji</Text>

            {comments.length === 0 ? (
                <Text style={styles.noComments}>Ni še komentarjev.</Text>
            ) : (
                <View style={{ maxHeight: 300, marginBottom: 16 }}>
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 10 }}
                        showsVerticalScrollIndicator={true}
                    >
                        {comments.map((item) => (
                            <View key={item.id} style={styles.commentCard}>
                                {item.tip_komentarja === 'glas' ? (
                                    <TouchableOpacity onPress={() => playSound(item.pot_glas!)}>
                                        <Image
                                            source={require('../../assets/images/zvok.png')}
                                            style={{ width: 150, height: 24 }}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <Text style={styles.content}>{item.vsebina}</Text>
                                )}
                                <Text style={styles.meta}>{item.cas} {item.lokacija}</Text>
                                <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                                    <Image
                                        source={require('../../assets/icons/deny_icon.png')}
                                        style={styles.deleteText}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}


            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Dodaj komentar..."
                    placeholderTextColor="#999"
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
                    <Text style={styles.sendButtonText}>Dodaj</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.recordWrapper]}>
                <TouchableOpacity
                    style={styles.sendVoiceButton}
                    onPress={recording ? stopRecording : startRecording}
                >
                    <Image
                        source={
                            recording
                                ? require("../../assets/icons/stop_icon.png")
                                : require("../../assets/icons/record_icon.png")
                        }
                        style={styles.recordIcon}
                    />
                </TouchableOpacity>

                {recording && (
                    <View>
                        <WaveformAnimation />
                    </View>
                )}
            </View>

        </View>
    );
}


