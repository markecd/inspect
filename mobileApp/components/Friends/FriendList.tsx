import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db as firestoreDb } from '../../modules/auth/firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { openDatabase } from '@/services/database';
import { syncFriendData } from '@/sync/syncFriendData';
import { styles } from '../../assets/styles/Friends/friends-list.style';

export default function FriendList() {
  const [input, setInput] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadFriends = async () => {
    let isMounted = true;
    try {
      const db = await openDatabase();
      const localUserIdStr = await AsyncStorage.getItem('local_user_id');
      if (!localUserIdStr) return;
      const localUserId = parseInt(localUserIdStr);

      const result = db.getAllSync<any>(
        `SELECT f.id AS id, f.username, f.level, f.xp
         FROM UPORABNIK f
         INNER JOIN PRIJATELJSTVO p ON f.id = p.tk_uporabnik2
         WHERE p.tk_uporabnik1 = ?
         ORDER BY f.xp DESC`,
        [localUserId]
      );

      if (isMounted) setFriends(result);
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
      const db = await openDatabase();
      const localUserIdStr = await AsyncStorage.getItem('local_user_id');
      if (!localUserIdStr) return;
      const localUserId = parseInt(localUserIdStr);

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

      db.runSync(
        `INSERT OR IGNORE INTO UPORABNIK (username, geslo, email, xp, level, firebase_uid)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [friendData.username, "", "", friendData.xp || 0, friendData.level || 1, friendUid]
      );

      const result = db.getFirstSync<any>(
        `SELECT id FROM UPORABNIK WHERE firebase_uid = ?`,
        [friendUid]
      );

      if (!result || !result.id) {
        setError('Napaka pri lokalnem shranjevanju prijatelja.');
        return;
      }

      const friendLocalId = result.id;

      db.runSync(
        `INSERT OR IGNORE INTO PRIJATELJSTVO (tk_uporabnik1, tk_uporabnik2)
         VALUES (?, ?)`,
        [localUserId, friendLocalId]
      );

      setInput('');
      await syncFriendData(friendUid);
      await loadFriends();
    } catch (err: any) {
      console.error('Napaka:', err);
      setError(err.message || 'Napaka pri dodajanju prijatelja.');
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    try {
      const db = await openDatabase();
      const localUserIdStr = await AsyncStorage.getItem('local_user_id');
      if (!localUserIdStr) return;
      const localUserId = parseInt(localUserIdStr);

      db.runSync(
        `DELETE FROM PRIJATELJSTVO WHERE tk_uporabnik1 = ? AND tk_uporabnik2 = ?`,
        [localUserId, friendId]
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
        friends.map((item, index) => (
          <View key={item.id} style={styles.friendItem}>
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
                <Text style={styles.friendName}>{item.username}</Text>
              </View>
              <Text style={styles.friendMeta}>
                Level {item.level} | XP {item.xp}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveFriend(item.id)}>
              <Image
                source={require('../../assets/icons/deny_icon.png')}
                style={styles.removeIcon}
              />
            </TouchableOpacity>
          </View>
        ))
      )}

      <View style={styles.addFriendBox}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Uporabniško ime"
          style={styles.input}
        />
        <TouchableOpacity style={styles.customButton} onPress={handleAddFriend}>
          <Text style={styles.customButtonText}>Dodaj</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
