// app/register.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../modules/auth/firebase/auth';
import { router } from 'expo-router';
import { Link } from 'expo-router';
import { openDatabase } from '../../services/database'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const userPoverilnice = await createUserWithEmailAndPassword(auth, email, password);
      const user = userPoverilnice.user;
      await sendEmailVerification(user);

      const db = await openDatabase();

      const existingUser = db.getFirstSync(
        `SELECT * FROM UPORABNIK WHERE username = ?`,
        [username]
      );
  
      if (existingUser) {
        setError("Uporabniško ime je že zasedeno. Izberite drugo.");
        return;
      }

      db.runSync(
        `INSERT INTO UPORABNIK (username, geslo, email, xp, level) VALUES (?, ?, ?, ?, ?)`,
        [username, password, email, 0, 1]
      );
  
      console.log('Uporabnik vstavljen v SQLite!');
      
      router.replace('/auth/login'); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Uporabniško ime" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Geslo" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Registracija" onPress={handleRegister} />
      <Link href="/auth/login">Že imate narejen račun? Kliknite tukaj!</Link>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  error: { color: 'red', marginTop: 10 },
});
