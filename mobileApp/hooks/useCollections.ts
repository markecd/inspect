import { useEffect, useState } from "react";
import { openDatabase } from "@/services/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Collection = {
  red_id: number;
  naziv_reda: string;
  skupno_rodov: number;
  najdenih_rodov: number;
  stars: number;
};

export function useCollections(userIdOverride?: number) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    

    const fetchCollections = async () => {
      try {
        const db = await openDatabase();

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

        console.log("Prikazujem kolekcije za userId:", resolvedUserId);



        const result = db.getAllSync<any>(
          `SELECT 
            RED.id AS red_id,
            RED.naziv_reda,
            COUNT(DISTINCT ROD.id) AS skupno_rodov,
            COUNT(DISTINCT OPAZANJE.TK_rod) AS najdenih_rodov
          FROM RED
          JOIN DRUZINA ON DRUZINA.TK_RED = RED.id
          JOIN ROD ON ROD.TK_DRUZINA = DRUZINA.id
          LEFT JOIN OPAZANJE ON OPAZANJE.TK_rod = ROD.id AND OPAZANJE.TK_uporabnik = ?
          GROUP BY RED.id`,
          [resolvedUserId]
        );

        const dataWithStars = result.map((item: any) => {
          const ratio =
            item.skupno_rodov > 0
              ? item.najdenih_rodov / item.skupno_rodov
              : 0;
          const stars = Math.round(ratio * 4);
          return { ...item, stars };
        });

        if (isMounted) {
          setCollections(dataWithStars);
        }
      } catch (error) {
        console.error("Napaka pri nalaganju kolekcij:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCollections();

    return () => {
      isMounted = false;
    };
  }, [userIdOverride]);

  return { collections, loading };
}
