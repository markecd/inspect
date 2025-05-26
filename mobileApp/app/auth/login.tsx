import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../modules/auth/firebase/auth";
import { router } from "expo-router";
import { Link } from "expo-router";
import { openDatabase } from "@/services/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      const result = db.getFirstSync<{ id: number }>(
        `SELECT id FROM UPORABNIK WHERE firebase_uid = ?`,
        [user.uid]
      );

      if (!result) {
        throw new Error("Uporabnik ni bil najden v lokalni bazi.");
      }

      await AsyncStorage.setItem("local_user_id", result.id.toString());
      router.push("/observation");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Geslo"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Prijava" onPress={handleLogin} />
      <Link href="/auth/register">Še niste registrirani? Kliknite tukaj!</Link>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  error: { color: "red", marginTop: 10 },
});
