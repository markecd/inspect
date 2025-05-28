import { useEffect, useState } from 'react';
import { openDatabase } from '../services/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { getAchievementDescription } from '../modules/gamification/utils/achievementUtils';

export type Achievement = {
  id: number;
  naziv: string;
  opis: string;
  xp_vrednost: number;
  dosezen: number;
};



export function useAchievements(userIdOverride?: number) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAchievements() {
      const db = await openDatabase();

      try {
        let resolvedUserId = userIdOverride;
        if (!resolvedUserId) {
          const localUserIdStr = await AsyncStorage.getItem("local_user_id");
          if (!localUserIdStr) {
            console.warn("local_user_id ni najden v AsyncStorage.");
            if (isMounted) setLoading(false);
            return;
          }
          resolvedUserId = parseInt(localUserIdStr);
        }

        const result = db.getAllSync<any>(
          `SELECT d.*, ud.tk_uporabnik IS NOT NULL AS dosezen
           FROM DOSEZEK d
           LEFT JOIN UPORABNIK_DOSEZEK ud
           ON ud.tk_dosezek = d.id AND ud.tk_uporabnik = ?`,
          [resolvedUserId]
        );

        const normalized = result.map((r: any) => ({
          ...r,
          dosezen: r.dosezen,
        }));

        if (isMounted) {
          setAchievements(normalized);
        }
      } catch (error) {
        console.error("Napaka pri branju dosežkov:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAchievements();

    return () => {
      isMounted = false;
    };
  }, [userIdOverride]);

  return { achievements, loading };
}
