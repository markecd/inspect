import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../assets/styles/Profile/profile-details.style';
import { auth, signOut } from '../../modules/auth/firebase/auth';
import { openDatabase } from '../../services/database';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  friendId?: number; // če je podan, prikazujemo prijateljev profil
};

export default function ProfileDetails({ friendId }: Props) {
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
      try {
        const db = await openDatabase();

        let userId: number;

        if (friendId !== undefined) {
          userId = friendId;
        } else {
          const localUserIdStr = await AsyncStorage.getItem("local_user_id");
          if (!localUserIdStr) {
            console.warn("local_user_id ni najden v AsyncStorage.");
            return;
          }
          userId = parseInt(localUserIdStr);
        }

        const result = db.getFirstSync<any>(
          `SELECT * FROM UPORABNIK WHERE id = ?`,
          [userId]
        );

        if (result) {
          setUser(result);
        } else {
          console.warn("Uporabnik ni v lokalni bazi.");
        }
      } catch (err) {
        console.error("Napaka pri branju iz baze:", err);
      }
    };

    fetchUser();
  }, [friendId]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Nalaganje profila...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.levelTag}>Level {user.level}</Text>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.username}>{user.username}</Text>
        {!friendId && (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Odjava</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.value}>46</Text>
          <Text style={styles.label}>opažanj</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.value}>10</Text>
          <Text style={styles.label}>kolekcij</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.value}>12</Text>
          <Text style={styles.label}>dosežkov</Text>
        </View>
      </View>
    </View>
  );
}
