import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getDocs, collection, doc, deleteDoc } from 'firebase/firestore';
import { db as firestoreDb } from '../../modules/auth/firebase/config';
import { auth } from '../../modules/auth/firebase/auth';
import { ScrollView } from "react-native-gesture-handler";
import { openDatabase } from '@/services/database';
import { syncFriendData } from '../../services/syncService';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    
    db.runSync(
      `INSERT OR IGNORE INTO UPORABNIK (username, firebase_uid, xp, level)
       VALUES (?, ?, ?, ?)`,
      [notif.od_username, notif.od_firebase_uid || "", 0, 1]
    );

    const result = db.getFirstSync<any>(
      `SELECT id FROM UPORABNIK WHERE username = ?`,
      [notif.od_username]
    );
    const friendLocalId = result?.id;
    if (!friendLocalId) return;

 
    db.runSync(`
      INSERT OR IGNORE INTO PRIJATELJSTVO (tk_uporabnik1, tk_uporabnik2)
      VALUES (?, ?)`,
      [localUserId, friendLocalId]);

    db.runSync(`
      INSERT OR IGNORE INTO PRIJATELJSTVO (tk_uporabnik1, tk_uporabnik2)
      VALUES (?, ?)`,
      [friendLocalId, localUserId]);

    
    if (notif.od_firebase_uid) {
      await syncFriendData(notif.od_firebase_uid);
    }

  
    const uid = auth.currentUser?.uid;
    if (uid) {
      await deleteDoc(doc(firestoreDb, "users", uid, "notifications", notif.id));
      await loadNotifications();
    }
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
            <Text style={styles.text}>Prošnja za prijateljstvo od: <Text style={styles.bold}>{notif.od_username}</Text></Text>
            <View style={styles.buttonRow}>
              <Button title="Sprejmi" onPress={() => handleAcceptRequest(notif)} />
              <Button title="Zavrni" color="#A44" onPress={() => handleDeclineRequest(notif)} />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notification: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  empty: {
    padding: 20,
    textAlign: 'center',
    color: 'gray',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});
