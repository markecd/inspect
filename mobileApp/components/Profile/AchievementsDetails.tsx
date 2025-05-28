import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from '@/services/database';
import styles from '../../assets/styles/Profile/profile-details.style';
import { showAchievementInfo } from "@/modules/gamification/utils/achievementUtils";

type Props = {
  friendId?: number;
};

type Achievement = {
  id: number;
  naziv: string;
  opis: string;
  xp_vrednost: number;
  dosezen: number;
};

export default function AchievementsDetails({ friendId }: Props) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      const db = await openDatabase();

      let userId: number;
      if (typeof friendId === 'number') {
        userId = friendId;
      } else {
        const localUserIdStr = await AsyncStorage.getItem('local_user_id');
        if (!localUserIdStr) {
          console.warn('local_user_id ni najden v AsyncStorage.');
          setLoading(false);
          return;
        }
        userId = parseInt(localUserIdStr);
      }

      console.log('Prikazujem dosežke za userId:', userId);

      const result = db.getAllSync<any>(
        `SELECT d.*, ud.tk_uporabnik IS NOT NULL AS dosezen
         FROM DOSEZEK d
         LEFT JOIN UPORABNIK_DOSEZEK ud
         ON ud.tk_dosezek = d.id AND ud.tk_uporabnik = ?`,
        [userId]
      );

      const normalized = result.map((r: any) => ({
        ...r,
        dosezen: r.dosezen,
      }));

      setAchievements(normalized);
      setLoading(false);
    };

    fetchAchievements();
  }, [friendId]);

  const getAchievementIcon = (id: number) => {
    return require('../../assets/images/achievement_1.png');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>🔄 Nalagam dosežene dosežke...</Text>
      </View>
    );
  }

  const dosezeni = achievements.filter((a) => a.dosezen === 1);

  return (
    <View style={styles.containerDosezki}>
      <Text style={styles.heading}>Dosežki</Text>

      {dosezeni.length == 0 && 
      <Text style={styles.noAchievementsText}>Ni še nobenih dosežkov!</Text>
      }
      <FlatList
        data={dosezeni}
      
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => showAchievementInfo(item.id)}>
            <Image
              source={getAchievementIcon(item.id)} 
              style={styles.achievementIcon}
            />
            <Text style={styles.cardTitle}>{item.naziv}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
