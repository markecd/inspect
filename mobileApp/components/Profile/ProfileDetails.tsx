import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../assets/styles/Profile/profile-details.style';
import { auth, signOut } from '../../modules/auth/firebase/auth';
import { openDatabase } from '../../services/database';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileDetails() {
  const [user, setUser] = useState<any>(null); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("local_user_id");
      router.replace('/auth/login');
    } catch (error) {
      console.error("Napaka pri odjavi:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const db = await openDatabase();
      const firebaseUser = auth.currentUser;

      if (!firebaseUser?.email) {
        console.warn("Uporabnik ni prijavljen.");
        return;
      }

      try {
        const result = db.getFirstSync<any>(
          `SELECT * FROM UPORABNIK WHERE email = ?`,
          [firebaseUser.email]
        );

        if (result) {
          setUser(result);
        } else {
          console.warn("Uporabnik ni v lokalni bazi brt");
        }
      } catch (err) {
        console.error("Pri branju podatkov iz baze error", err);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Nalaganje profila...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <Text style={styles.username}>{user.username}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.value}>46</Text><Text style={styles.label}>opažanj</Text>
        <Text style={styles.value}>5</Text><Text style={styles.label}>kolekcij</Text>
        <Text style={styles.value}>12</Text><Text style={styles.label}>dosežkov</Text>
        <Text style={styles.label}>Član od 2022</Text>
      </View>

      <Text style={styles.levelTag}>Level {user.level}</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Odjava</Text>
      </TouchableOpacity>
    </View>
  );
}
