import { collection, getDocs } from "firebase/firestore";
import { openDatabase } from "../services/database";
import { db as firestoreDb } from "../modules/auth/firebase/config";

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

}
