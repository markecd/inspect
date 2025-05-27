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

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const db = await openDatabase();
        const localUserIdStr = await AsyncStorage.getItem("local_user_id");
        const userId = Number(localUserIdStr);

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
          [userId]
        );

        const dataWithStars = result.map((item: any) => {
          const ratio =
            item.skupno_rodov > 0
              ? item.najdenih_rodov / item.skupno_rodov
              : 0;
          const stars = Math.round(ratio * 4);
          return { ...item, stars };
        });

        setCollections(dataWithStars);
      } catch (error) {
        console.error("Napaka pri nalaganju kolekcij:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return { collections, loading };
}
