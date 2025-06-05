// app/register.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../modules/auth/firebase/auth';
import { db } from '../../modules/auth/firebase/config'
import { router } from 'expo-router';
import { Link } from 'expo-router';
import { openDatabase } from '../../services/database'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';


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

      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: user.email,
        xp: 0,
        level: 1,
      });

      const localDb = await openDatabase();
      
      localDb.runSync(
        `INSERT INTO UPORABNIK (username, geslo, email, xp, level, firebase_uid) VALUES (?, ?, ?, ?, ?, ?)`,
        [username, password, email, 0, 1, user.uid]
      );
  
      console.log('Uporabnik vstavljen v SQLite!');
      
      router.replace('/auth/login'); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor:'#6C584C'}} behavior={"padding"} keyboardVerticalOffset={10}>
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../assets/images/splash-icon.png')}></Image>
      <TextInput placeholderTextColor="#F0EAD2" placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholderTextColor="#F0EAD2" placeholder="Uporabniško ime" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholderTextColor="#F0EAD2" placeholder="Geslo" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registracija</Text>
      </TouchableOpacity>
      <Link style={styles.link} href="/auth/login">Že imate narejen račun? Kliknite tukaj!</Link>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  image: {left: 70, width:250, height:250},
  button: {backgroundColor: "#A98467", alignItems:"center", padding: 10, borderRadius: 10, marginBottom: 10, elevation: 5},
  link: {fontSize: 15, color:'#F0EAD2'},
  buttonText: {color:"#F0EAD2", fontWeight: 'bold', fontSize: 15},
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: '#6C584C' },
  input: { borderWidth: 2,padding: 10 ,borderColor: "#F0EAD2", color:"#F0EAD2", marginBottom: 10, borderRadius: 10},
  error: { color: "red", fontSize: 15, fontWeight: 'bold',marginTop: 10 },
});
