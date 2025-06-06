import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  getDocs,
  query,
  where,
  collection,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db as firestoreDb } from '../../modules/auth/firebase/config';
import { auth } from '../../modules/auth/firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { openDatabase } from '@/services/database';
import { styles } from '../../assets/styles/Friends/friends-list.style';
import { useNetInfo } from '@react-native-community/netinfo';

export default function FriendList() {
  const [input, setInput] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [localUserId, setLocalUserId] = useState<number | null>(null);

  const router = useRouter();
    const netInfo = useNetInfo();

    const loadFriends = async () => {
      let isMounted = true;
      try {
        const db = await openDatabase();
        const localUserIdStr = await AsyncStorage.getItem('local_user_id');
        if (!localUserIdStr) return;
        const localUserId = parseInt(localUserIdStr);
        setLocalUserId(localUserId);
    
        const result = db.getAllSync<any>(
          `SELECT f.id AS id, f.username, f.level, f.xp
           FROM UPORABNIK f
           INNER JOIN PRIJATELJSTVO p ON f.id = p.tk_uporabnik2
           WHERE p.tk_uporabnik1 = ?`,
          [localUserId]
        );
    
        const self = db.getFirstSync<any>(
          `SELECT id, username, level, xp FROM UPORABNIK WHERE id = ?`,
          [localUserId]
        );
    
        if (self) {
          const combined = [...result, self];
    
          const unique = combined.filter(
            (item, index, arr) => arr.findIndex(u => u.id === item.id) === index
          );
    
          const sorted = unique.sort((a, b) => b.xp - a.xp);
    
          if (isMounted) setFriends(sorted);
        } else {
          if (isMounted) setFriends(result);
        }
      } catch (err) {
        console.error('Napaka pri nalaganju prijateljev:', err);
      }
      return () => {
        isMounted = false;
      };
    };
    

    
  const handleAddFriend = async () => {
    try {
      setError('');
  
      
      const localUserIdStr = await AsyncStorage.getItem('local_user_id');
      if (!localUserIdStr) return;
      const localUserId = parseInt(localUserIdStr);
  
   
      const localDb = await openDatabase();
      const userData = localDb.getFirstSync<{ username: string }>(
        "SELECT username FROM UPORABNIK WHERE id = ?",
        [localUserId]
      );
  
      if (!userData?.username) {
        setError("Ni mogoče pridobiti uporabniškega imena.");
        return;
      }
      const localUsername = userData.username;
  
      
      const senderFirebaseUid = auth.currentUser?.uid;
      if (!senderFirebaseUid) return;
  
     
      const q = query(
        collection(firestoreDb, 'users'),
        where('username', '==', input.trim())
      );
      const snapshot = await getDocs(q);
  
      if (snapshot.empty) {
        setError('Uporabnik ne obstaja.');
        return;
      }
  
      const friendDoc = snapshot.docs[0];
      const friendData = friendDoc.data();
      const friendUid = friendDoc.id;
  
      if (!friendData.username) {
        setError('Podatki niso veljavni.');
        return;
      }
  
    
      const notifQuery = query(
        collection(doc(firestoreDb, "users", friendUid), "notifications"),
        where("tip", "==", "friend_request"),
        where("od_username", "==", localUsername)
      );
      const existing = await getDocs(notifQuery);
      if (!existing.empty) {
        setError("Prošnja je že bila poslana.");
        return;
      }
  
    
      const notifRef = collection(
        doc(firestoreDb, "users", friendUid),
        "notifications"
      );
  
      await addDoc(notifRef, {
        tip: "friend_request",
        od: localUserId,
        od_username: localUsername,
        od_firebase_uid: senderFirebaseUid,
        prebrano: false,
        cas: serverTimestamp()
      });
  
      setInput('');
    } catch (err: any) {
      console.error('Napaka:', err);
      setError(err.message || 'Napaka pri pošiljanju prošnje.');
    }
  };
  

  const handleRemoveFriend = async (friendId: number) => {
    try {
      const db = await openDatabase();
      const localUserIdStr = await AsyncStorage.getItem('local_user_id');
      if (!localUserIdStr) return;
      const localUserId = parseInt(localUserIdStr);
  
      db.runSync(
        `DELETE FROM PRIJATELJSTVO
         WHERE (tk_uporabnik1 = ? AND tk_uporabnik2 = ?)
            OR (tk_uporabnik1 = ? AND tk_uporabnik2 = ?)`,
        [localUserId, friendId, friendId, localUserId]
      );
  
      const drugePovezave = db.getFirstSync<any>(
        `SELECT 1 FROM PRIJATELJSTVO WHERE tk_uporabnik2 = ? OR tk_uporabnik1 = ? LIMIT 1`,
        [friendId, friendId]
      );
  
      if (!drugePovezave) {
        db.runSync(`DELETE FROM OPAZANJE WHERE TK_uporabnik = ?`, [friendId]);
        db.runSync(`DELETE FROM UPORABNIK_DOSEZEK WHERE TK_uporabnik = ?`, [friendId]);
        db.runSync(`DELETE FROM UPORABNIK WHERE id = ?`, [friendId]);
      }

      const currentUid = auth.currentUser?.uid;

      const friendFirebaseUid = db.getFirstSync<any>(
        `SELECT firebase_uid FROM UPORABNIK WHERE id = ?`,
        [friendId]
      )?.firebase_uid;



      if (currentUid && friendFirebaseUid) {
        await deleteDoc(doc(firestoreDb, "users", currentUid, "friends", friendFirebaseUid));
        await deleteDoc(doc(firestoreDb, "users", friendFirebaseUid, "friends", currentUid));
      }
  
      await loadFriends();
    } catch (err) {
      console.error("Napaka pri odstranitvi prijatelja:", err);
    }
  };
  

  useEffect(() => {
    loadFriends();
  }, []);

  const getMedal = (index: number) => {
    if (index === 0) return require('../../assets/icons/gold_medal.png');
    if (index === 1) return require('../../assets/icons/silver_medal.png');
    if (index === 2) return require('../../assets/icons/bronze_medal.png');
    return null;
  };

  return (
    <View style={styles.container}>
  {friends.length === 0 ? (
    <Text style={styles.empty}>Ni prijateljev</Text>
  ) : (
    friends.map((item, index) => {
      const isSelf = item.id === localUserId;

      return (
        <View
          key={item.id}
          style={[
            styles.friendItem,
            isSelf && {
              borderColor: '#BC9143',
              borderWidth: 2,
              backgroundColor: '#5f4c3d', 
            },
          ]}
        >
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/profile',
                params: { id: item.id.toString() },
              })
            }
            style={styles.friendInfo}
          >
            <View style={styles.nameWithMedal}>
              {getMedal(index) && (
                <Image source={getMedal(index)!} style={styles.medalIcon} />
              )}
              <Text style={styles.friendName}>
                {item.username}
              </Text>
            </View>
            <Text style={styles.friendMeta}>
              #{index + 1} — Level {item.level} | XP {item.xp}
            </Text>
          </TouchableOpacity>

        
          {!isSelf && (
            <TouchableOpacity onPress={() => handleRemoveFriend(item.id)}>
              {netInfo.isConnected && (
                <Image
                  source={require('../../assets/icons/deny_icon.png')}
                  style={styles.removeIcon}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      );
    })
  )}


  {netInfo.isConnected && (
    <>
      <Text style={styles.empty}>Pošlji prošnjo za prijateljstvo</Text>
      <View>
        <View style={styles.addFriendBox}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Uporabniško ime"
            style={styles.input}
          />
          <TouchableOpacity style={styles.customButton} onPress={handleAddFriend}>
            <Text style={styles.customButtonText}>Pošlji</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </>
  )}
</View>

  );
  
}
