import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db as firestoreDb } from '../../modules/auth/firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { openDatabase } from '@/services/database';
import { syncFriendData } from '@/sync/syncFriendData';

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
         WHERE p.tk_uporabnik1 = ?`,
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prijatelji</Text>

      {friends.length === 0 ? (
        <Text style={styles.empty}>Ni prijateljev</Text>
      ) : (
        friends.map((item) => (
          <View key={item.id} style={styles.friendItem}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/profile',
                  params: { id: item.id.toString() },
                })
              }
            >
              <Text style={styles.friendName}>{item.username}</Text>
              <Text style={styles.friendMeta}>
                Level {item.level} | XP {item.xp}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveFriend(item.id)}>
              <Text style={styles.removeText}>❌</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <View style={styles.addFriendBox}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Dodaj prijatelja (username)"
          style={styles.input}
        />
        <Button title="Dodaj" onPress={handleAddFriend} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  friendItem: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendName: { fontSize: 18 },
  friendMeta: { fontSize: 14, color: '#555' },
  removeText: { fontSize: 18, color: 'red', marginLeft: 10 },
  empty: { marginTop: 20, fontStyle: 'italic', color: '#888' },
  addFriendBox: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  error: { color: 'red', marginTop: 10 },
});
