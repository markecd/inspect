import NetInfo from '@react-native-community/netinfo';
import { db as firestoreDb, storage } from "@/modules/auth/firebase/config";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import { openDatabase } from "@/services/database";
import AsyncStorage from "@react-native-async-storage/async-storage";


let netInfoListenerAdded = false;
let lastSyncTime = 0;


export function initializeNetInfoListener() {
  if (netInfoListenerAdded) return;
  netInfoListenerAdded = true;

  NetInfo.addEventListener(state => {
    const now = Date.now();
    if (state.isConnected && now - lastSyncTime > 10000) {
      console.log("NetInfo sync triggered...");
      lastSyncTime = now;
      syncData();
      syncAllFriendsData();
    }
  });
}

export async function insertImageInFirestore(observationId: number, imagePath: string){
    const netInfo = (await NetInfo.fetch()).isConnected;
    if(!netInfo) return;

    try{
    const response = await fetch(imagePath);
    const blob = await response.blob();

    const fileName = imagePath.split("/").pop() || `photo_${Date.now()}.jpg`;
    const path = `observations/${Date.now()}_${fileName}`;
    
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);

    const imageUrl = await getDownloadURL(storageRef);

    const firebaseUid = await AsyncStorage.getItem("user_firestore_id");

    const observationRef = doc(firestoreDb, "users", firebaseUid!, "observations", observationId.toString());
    await setDoc(observationRef, {image_path: imageUrl}, {merge: true});
    } catch (error) {
      console.error(error);
    }
}

export async function saveObservationInFirestore(observationId: number, naziv: string, cas: string, lokacija: string, image_path: string){
    const netInfo = (await NetInfo.fetch()).isConnected;
    if(!netInfo) return;
    const firebaseUid = await AsyncStorage.getItem("user_firestore_id");
    const ref = doc(collection(firestoreDb, "users", firebaseUid!, "observations"), String(observationId));
    await setDoc(ref, {
      naziv: naziv,
      cas: cas,
      lokacija: lokacija,
      TK_rod: observationId,
    });
    await insertImageInFirestore(observationId, image_path);
}



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
      saveObservationInFirestore(o.TK_rod, o.naziv, o.cas, o.lokacija, o.pot_slike);
    }

    console.log("Sinhronizacija uspešno zaključena");
  } catch (err) {
    console.error("Napaka pri sinhronizaciji:", err);
  }
}

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
      `INSERT OR IGNORE INTO DOSEZEK (id, naziv, xp_vrednost, opis) VALUES (?, ?, ?, ?)`,
      [achievementId, a.naziv, a.xp_vrednost, a.opis]
    );
    db.runSync(
      `UPDATE DOSEZEK SET naziv = ?, xp_vrednost = ?, opis = ? WHERE id = ?`,
      [a.naziv, a.xp_vrednost, a.opis, achievementId]
    );

    const exists = db.getFirstSync<any>(
      `SELECT 1 FROM UPORABNIK_DOSEZEK WHERE tk_uporabnik = ? AND tk_dosezek = ?`,
      [localFriendId, achievementId]
    );

    if (!exists) {
      db.runSync(
        `INSERT INTO UPORABNIK_DOSEZEK (tk_uporabnik, tk_dosezek) VALUES (?, ?)`,
        [localFriendId, achievementId]
      );
    }
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

    const exists = db.getFirstSync<any>(
      `SELECT 1 FROM OPAZANJE WHERE TK_rod = ? AND TK_uporabnik = ?`,
      [o.TK_rod, localFriendId]
    );

    if (rodExists && uporabnikExists && !exists) {
      db.runSync(
        `INSERT INTO OPAZANJE (naziv, lokacija, cas, pot_slike, TK_uporabnik, TK_rod)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [o.naziv, o.lokacija, o.cas, '',localFriendId, o.TK_rod]
      );
      insertedCount++;
    }
  }

  console.log(`Prijateljevi dosežki in opažanja sinhronizirani. Vstavljeno opažanj: ${insertedCount}`);
}

export async function syncAllFriendsData() {
  try {
    const db = await openDatabase();
    const localUserIdStr = await AsyncStorage.getItem("local_user_id");
    if (!localUserIdStr) return;
    const localUserId = parseInt(localUserIdStr);

    const friends = db.getAllSync<{ firebase_uid: string }>(
      `SELECT u.firebase_uid
       FROM UPORABNIK u
       JOIN PRIJATELJSTVO p ON u.id = p.tk_uporabnik2
       WHERE p.tk_uporabnik1 = ? AND u.firebase_uid IS NOT NULL`,
      [localUserId]
    );

    console.log(`[syncAllFriendsData] Najdenih prijateljev za sync: ${friends.length}`);

    for (const friend of friends) {
      await syncFriendData(friend.firebase_uid);
    }

    console.log("[syncAllFriendsData] Sinhronizacija vseh prijateljev končana.");
  } catch (error) {
    console.error("[syncAllFriendsData] Napaka pri sinhronizaciji prijateljev:", error);
  }
}
