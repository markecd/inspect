import NetInfo from '@react-native-community/netinfo';
import { db as firestoreDb } from "@/modules/auth/firebase/config";
import { collection, doc, setDoc } from "firebase/firestore";
import { openDatabase } from "@/services/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from 'react';


export async function syncData() {
      
  try {
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

    const firebaseUid = result.firebase_uid;

    
    const userData = dbLocal.getFirstSync<any>(
      "SELECT username, email, xp, level FROM UPORABNIK WHERE id = ?",
      [localUserId]
    );

    if (userData) {
      const userRef = doc(firestoreDb, "users", firebaseUid);
      await setDoc(userRef, {
        username: userData.username,
        email: userData.email,
        xp: userData.xp,
        level: userData.level,
      });
    }

   
    const achievements = dbLocal.getAllSync<any>(
      `SELECT d.id, d.naziv, d.opis, d.xp_vrednost
       FROM DOSEZEK d
       JOIN UPORABNIK_DOSEZEK u ON d.id = u.tk_dosezek
       WHERE u.tk_uporabnik = ?`,
      [localUserId]
    );

    for (const a of achievements) {
      const ref = doc(collection(firestoreDb, "users", firebaseUid, "achievements"), String(a.id));
      await setDoc(ref, {
        naziv: a.naziv,
        opis: a.opis,
        xp_vrednost: a.xp_vrednost,
        dosezen: 1,
      });
    }

    const observations = dbLocal.getAllSync<any>(
      "SELECT * FROM OPAZANJE WHERE TK_uporabnik = ?",
      [localUserId]
    );

    for (const o of observations) {
      const ref = doc(collection(firestoreDb, "users", firebaseUid, "observations"), String(o.id));
      await setDoc(ref, {
        naziv: o.naziv,
        cas: o.cas,
        lokacija: o.lokacija,
        TK_rod: o.TK_rod,
      });
    }

    console.log("Sinhronizacija uspešno zaključena");
  } catch (err) {
    console.error("Napaka pri sinhronizaciji:", err);
  }
}

NetInfo.addEventListener(state => {
  if (state.isConnected) {
    syncData();
  }
});
