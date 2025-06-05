import { getDoc, getDocs, collection, doc } from "firebase/firestore";
import { auth } from '../modules/auth/firebase/auth';
import { db as firestoreDb } from "@/modules/auth/firebase/config";
import { openDatabase } from "@/services/database";
import { syncFriendData } from "@/services/syncService";

export async function syncFriendList() {
  try {
    const db = await openDatabase();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const friendsSnap = await getDocs(
      collection(firestoreDb, "users", currentUser.uid, "friends")
    );

    for (const friendDoc of friendsSnap.docs) {
      const friendUid = friendDoc.id;
      const friendData = friendDoc.data();

      
      if (friendData.status !== "accepted") continue;

      const localFriend = db.getFirstSync<any>(
        `SELECT id FROM UPORABNIK WHERE firebase_uid = ?`,
        [friendUid]
      );


      if (!localFriend) {
        const userSnap = await getDoc(doc(firestoreDb, "users", friendUid));
        if (!userSnap.exists()) continue;

        const u = userSnap.data();

        db.runSync(
          `INSERT INTO UPORABNIK (username, geslo, email, xp, level, firebase_uid)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [u.username || "", "", u.email || "", u.xp || 0, u.level || 1, friendUid]
        );
      }

      await syncFriendData(friendUid);
    }

    console.log("Prijatelji iz Firestore sinhronizirani.");
  } catch (error) {
    console.error("Napaka pri syncFriendsFromFirestore:", error);
  }
}
