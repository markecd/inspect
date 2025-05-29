import NetInfo from '@react-native-community/netinfo';
import { db as firestoreDb } from "@/modules/auth/firebase/config";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { openDatabase } from "@/services/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      const ref = doc(collection(firestoreDb, "users", firebaseUid, "observations"), String(o.TK_rod));
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

export async function syncFriendData(firebaseUid: string) {
  const db = await openDatabase();

  
  const result = db.getFirstSync<any>(
    `SELECT id FROM UPORABNIK WHERE firebase_uid = ?`,
    [firebaseUid]
  );

  if (!result || !result.id) {
    console.warn("Ni najden lokalni uporabnik za Firebase UID:", firebaseUid);
    return;
  }

  const localFriendId = result.id;
  console.log("Sinhroniziram podatke za localFriendId:", localFriendId);

 
  const achievementsSnap = await getDocs(
    collection(firestoreDb, "users", firebaseUid, "achievements")
  );
  for (const docSnap of achievementsSnap.docs) {
    const a = docSnap.data();
    const achievementId = parseInt(docSnap.id);

    db.runSync(
      `INSERT OR REPLACE INTO DOSEZEK (id, naziv, opis, xp_vrednost) VALUES (?, ?, ?, ?)`,
      [achievementId, a.naziv, a.opis, a.xp_vrednost]
    );

    db.runSync(
      `INSERT OR REPLACE INTO UPORABNIK_DOSEZEK (tk_uporabnik, tk_dosezek) VALUES (?, ?)`,
      [localFriendId, achievementId]
    );
  }

  
  const observationsSnap = await getDocs(
    collection(firestoreDb, "users", firebaseUid, "observations")
  );

  let insertedCount = 0;

  for (const docSnap of observationsSnap.docs) {
    const o = docSnap.data();

    const rodExists = db.getFirstSync<any>(
      `SELECT id FROM ROD WHERE id = ?`,
      [o.TK_rod]
    );

    const uporabnikExists = db.getFirstSync<any>(
      `SELECT id FROM UPORABNIK WHERE id = ?`,
      [localFriendId]
    );

    if (rodExists && uporabnikExists) {
      db.runSync(
        `INSERT INTO OPAZANJE (naziv, cas, lokacija, pot_slike, TK_rod, TK_uporabnik)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          o.naziv,
          o.cas,
          o.lokacija,
          '',
          o.TK_rod,
          localFriendId
        ]
      );

      console.log("Vstavljeno opažanje:", {
        naziv: o.naziv,
        TK_rod: o.TK_rod,
        TK_uporabnik: localFriendId
      });

      insertedCount++;
    } else {
      console.warn("Manjka ROD ali UPORABNIK za opažanje:", {
        TK_rod: o.TK_rod,
        TK_uporabnik: localFriendId,
        rodExists,
        uporabnikExists
      });
    }
  }

  console.log(`Prijateljevi dosežki in opažanja sinhronizirani. Vstavljeno opažanj: ${insertedCount}`);


  const allObs = db.getAllSync<any>(
    `SELECT * FROM OPAZANJE WHERE TK_uporabnik = ?`,
    [localFriendId]
  );
  console.log("Trenutna opažanja za userId", localFriendId, ":", allObs);
}