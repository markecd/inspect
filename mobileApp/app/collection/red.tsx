import {
  View,Text
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { styles } from "../../assets/styles/Collection/collection.styles";
import { openDatabase } from "@/services/database";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import DruzinaSection from "@/components/Collection/DruzinaSection";

type InsectsOfRedRow = {
  naziv_rodu: string;
  najdeno: number;
  nahajalisce_rodu: string;
  naziv_druzine: string;
  lokacija: string;
  cas: string;
  pot_slike: string;
};
const map: Record<string, number> = {
  Bogomolke: 5,
  Dvokrilci: 4,
  Hrošči: 1,
  "Kačji pastirji": 6,
  Kobilice: 2,
  Kožekrilci: 7,
  Metulji: 3,
  Polkrilci: 8,
};

export default function RedPage() {
  const { red } = useLocalSearchParams();
  const [redData, setRedData] = useState<
    null | { druzina: string; insects: InsectsOfRedRow[] }[]
  >(null);
  useEffect(() => {
    (async () => {
      try {
        console.log("ajaa", red);
        const db = await openDatabase();
        const redId = map[red as string];
        const result = await db.getAllAsync<InsectsOfRedRow>(
          `
                        SELECT r.naziv_rodu, r.najdeno, r.nahajalisce_rodu, d.naziv_druzine, o.lokacija, o.cas, o.pot_slike
                        FROM ROD r 
                        LEFT JOIN OPAZANJE o ON r.id = o.TK_rod
                        LEFT JOIN DRUZINA d ON r.TK_DRUZINA = d.id
                        WHERE d.TK_RED = ?
                        ORDER BY d.naziv_druzine
                    `,
          [redId]
        );

        processData(result);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  function processData(data: InsectsOfRedRow[]) {
    const uniqueDruzine = [...new Set(data.map((item) => item.naziv_druzine))];
    console.log(uniqueDruzine);
    const preprocessed = uniqueDruzine.map((druzina) => ({
      druzina,
      insects: data.filter((insect) => insect.naziv_druzine == druzina),
    }));
    console.log(preprocessed[1])
    setRedData(preprocessed);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.redContentContainer}>
        {redData?.map((item, index) => (
            <DruzinaSection key={index} imeDruzine={item.druzina} insects={item.insects} />
        ))}
      </ScrollView>
    </View>
  );
}
