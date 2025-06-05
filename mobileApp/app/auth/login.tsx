import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../modules/auth/firebase/auth";
import { router } from "expo-router";
import { Link } from "expo-router";
import { openDatabase } from "@/services/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStats } from "@/modules/gamification/contexts/UserStatsContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setStats } = useUserStats();

  const handleLogin = async () => {
    try {
      const userPoverilnice = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userPoverilnice.user;
      if (!user.emailVerified) {
        const error = new Error(
          "Email ni potrjen. Prosimo preverite svoj email."
        );
        throw error;
      }

      const db = await openDatabase();
      const result = db.getFirstSync<{ id: number, xp: number, level: number }>(
        `SELECT id, xp, level FROM UPORABNIK WHERE firebase_uid = ?`,
        [user.uid]
      );

      if (!result) {
        throw new Error("Uporabnik ni bil najden v lokalni bazi.");
      }

      await AsyncStorage.setItem("local_user_id", result.id.toString());
      await AsyncStorage.setItem("user_xp", result.xp.toString());
      await AsyncStorage.setItem("user_level", result.level.toString());
      await AsyncStorage.setItem("user_firestore_id", user.uid);
      const xp = result.xp;
      const level = result.level;
      setStats({ xp , progress: xp % 250, levelUp: false, level: level})
      router.push("/observation");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor:'#6C584C'}} behavior={"padding"} keyboardVerticalOffset={5}>
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../assets/images/splash-icon.png')}></Image>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#F0EAD2"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Geslo"
        placeholderTextColor="#F0EAD2"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Prijava</Text>
      </TouchableOpacity>
      <Link style={styles.link} href="/auth/register">Še niste registrirani? Kliknite tukaj!</Link>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  image: {left: 70,height: 250, width: 250},
  button: {backgroundColor: "#A98467", alignItems:"center", padding: 10, borderRadius: 10, marginBottom: 10, elevation: 5},
  link: {fontSize: 15, color:'#F0EAD2'},
  buttonText: {color:"#F0EAD2", fontWeight: 'bold', fontSize: 15},
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: '#6C584C' },
  input: { borderWidth: 2,padding: 10 ,borderColor: "#F0EAD2", color:"#F0EAD2", marginBottom: 10, borderRadius: 10},
  error: { color: "red", fontSize: 15, fontWeight: 'bold',marginTop: 10 }
});
