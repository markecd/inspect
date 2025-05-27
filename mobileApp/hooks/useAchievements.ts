import { useEffect, useState } from 'react';
import { openDatabase } from '../services/database';
import { auth } from '../modules/auth/firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


type Achievement = {
  id: number;
  naziv: string;
  opis: string;
  xp_vrednost: number;
  dosezen: number;
};

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      const db = await openDatabase();

      try {
    
        const localUserIdStr = await AsyncStorage.getItem("local_user_id");
        if (!localUserIdStr) {
          console.warn("local_user_id ni najden v AsyncStorage.");
          setLoading(false);
          return;
        }

        const userId = parseInt(localUserIdStr);

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
      } catch (error) {
        console.error("Napaka pri branju dosežkov:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, []);

  return { achievements, loading };
}
