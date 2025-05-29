import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { getDocs, collection, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db as firestoreDb } from '../../modules/auth/firebase/config';
import { auth } from '../../modules/auth/firebase/auth';
import { ScrollView } from "react-native-gesture-handler";
import { openDatabase } from '@/services/database';
import { syncFriendData } from '../../services/syncService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/styles/Notifications/notifications-list.style'

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = async () => {
    const dbLocal = await openDatabase();
    const localUserIdStr = await AsyncStorage.getItem("local_user_id");
    if (!localUserIdStr) return;

    const localUserId = parseInt(localUserIdStr);


    const result = dbLocal.getFirstSync<{ firebase_uid: string }>(
      "SELECT firebase_uid FROM UPORABNIK WHERE id = ?",
      [localUserId]
    );

    if (!result?.firebase_uid) {
      console.warn("Firebase UID ni bil najden za lokalnega uporabnika.");
      return;
    }

    const uid = result.firebase_uid;

    const notifsRef = collection(doc(firestoreDb, "users", uid), "notifications");
    const snapshot = await getDocs(notifsRef);

    const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotifications(notifs);
  };

  const handleAcceptRequest = async (notif: any) => {
    const db = await openDatabase();
    const localUserIdStr = await AsyncStorage.getItem("local_user_id");
    if (!localUserIdStr) return;
    const localUserId = parseInt(localUserIdStr);
  
    if (!notif.od_firebase_uid) {
      console.warn("Povabilo brez Firebase UID. Ne morem sprejeti.");
      return;
    }
  
   
    const friendDocRef = doc(firestoreDb, 'users', notif.od_firebase_uid);
    const friendSnapshot = await getDoc(friendDocRef);
    if (!friendSnapshot.exists()) {
      console.warn("Ni mogoče pridobiti podatkov o prijatelju iz Firestore.");
      return;
    }
    const friendData = friendSnapshot.data();
  
   
    db.runSync(
      `INSERT OR IGNORE INTO UPORABNIK (username, geslo, email, xp, level, firebase_uid)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        notif.od_username,
        '',
        '',
        friendData.xp || 0,
        friendData.level || 1,
        notif.od_firebase_uid
      ]
    );
  
    db.runSync(
      `UPDATE UPORABNIK SET xp = ?, level = ? WHERE firebase_uid = ?`,
      [friendData.xp || 0, friendData.level || 1, notif.od_firebase_uid]
    );
  
    
    const result = db.getFirstSync<any>(
      `SELECT id FROM UPORABNIK WHERE firebase_uid = ?`,
      [notif.od_firebase_uid]
    );
    const friendLocalId = result?.id;
    if (!friendLocalId) return;
  
   
    db.runSync(`INSERT OR IGNORE INTO PRIJATELJSTVO (tk_uporabnik1, tk_uporabnik2) VALUES (?, ?)`, [localUserId, friendLocalId]);
    db.runSync(`INSERT OR IGNORE INTO PRIJATELJSTVO (tk_uporabnik1, tk_uporabnik2) VALUES (?, ?)`, [friendLocalId, localUserId]);
  
    
    await syncFriendData(notif.od_firebase_uid);
  
   
    const uid = auth.currentUser?.uid;
    if (uid) {
      await deleteDoc(doc(firestoreDb, "users", uid, "notifications", notif.id));
      await loadNotifications();
    }
  
    console.log("Povabilo sprejeto in sinhronizirano.");
  };
  
  
  

  const handleDeclineRequest = async (notif: any) => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      await deleteDoc(doc(firestoreDb, "users", uid, "notifications", notif.id));
      await loadNotifications();
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <ScrollView>
      {notifications.length === 0 ? (
        <Text style={styles.empty}>Ni novih obvestil</Text>
      ) : (
        notifications.map((notif) => (
          <View key={notif.id} style={styles.notification}>
            <Text style={styles.text}>Prošnja za prijateljstvo od <Text style={styles.bold}>{notif.od_username}</Text></Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.customAccept} onPress={() => handleAcceptRequest(notif)}>
                <Text style={styles.customButtonText}>Sprejmi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.customDecline} onPress={() => handleDeclineRequest(notif)}>
                <Text style={styles.customButtonText}>Zavrni</Text>
              </TouchableOpacity>
        </View>

          </View>
        ))
      )}
    </ScrollView>
  );
}

