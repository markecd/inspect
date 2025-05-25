import { View, Text, TouchableOpacity, Image } from "react-native";
import { useEffect, useState, useRef } from "react";
import { styles } from "../../assets/styles/Observation/details.styles";
import { router, useLocalSearchParams } from "expo-router";
import labels from "../../assets/labels.json";
import { openDatabase } from "../../services/database";
import { ScrollView } from "react-native-gesture-handler";

type Insect = {
  id: number;
  red: string;
  druzina: string;
  naziv_rodu: string;
  latinski_naziv_rodu: string;
  opis_rodu: string;
};

export default function DetailsPage() {
  const { prediction, photoUri } = useLocalSearchParams();
  const [insectData, setInsectData] = useState<null | Insect>(null);
  const [photoPath, setPhotoPath] = useState<null | string>("");

  useEffect(() => {
    (async () => {
      setPhotoPath(photoUri as string);
      const rodId = parseInt(
        (labels as Record<string, string>)[prediction.toString()]
      );

      const db = await openDatabase();
      const result = db.getFirstSync<Insect>(
        `
          SELECT 
            ROD.id,
            RED.naziv_reda AS red,
            DRUZINA.naziv_druzine AS druzina,
            ROD.naziv_rodu,
            ROD.latinski_naziv_rodu,
            ROD.opis_rodu
          FROM ROD
          JOIN DRUZINA ON ROD.TK_DRUZINA = DRUZINA.id
          JOIN RED ON DRUZINA.TK_RED = RED.id
          WHERE ROD.id = ?
          `,
        [rodId]
      );
      setInsectData(result);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.mainDetailContainer}>
          <View style={styles.imageContainer}>
            {photoPath && (
              <Image source={{ uri: photoPath }} style={styles.insectImage} />
            )}
          </View>
          <View style={styles.mainInfoContainer}>
            <Text style={styles.insectName}>{insectData?.naziv_rodu}</Text>
            <Text style={styles.insectScientificName}>
              {insectData?.latinski_naziv_rodu}
            </Text>
            <View style={styles.taxonomyTree}>
              <Text style={styles.insectOrderName}>{insectData?.red}</Text>
              <Image
                source={require("../../assets/icons/arrow_icon.png")}
                style={styles.arrowIcon}
              />
              <Text style={styles.insectFamilyName}>{insectData?.druzina}</Text>
              <Image
                source={require("../../assets/icons/arrow_icon.png")}
                style={styles.arrowIcon}
              />
              <Text style={styles.insectOrderName}>{insectData?.naziv_rodu}</Text>
            </View>
          </View>
        </View>
        <ScrollView style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{insectData?.opis_rodu}</Text>
        </ScrollView>
      </View>
      <View style={styles.line}></View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.denyButton}
          onPress={() => router.push("/observation")}
        >
          <Image
            source={require("../../assets/icons/deny_icon.png")}
            style={styles.confirmIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => router.push("/collection")}
        >
          <Image
            source={require("../../assets/icons/confirm_icon.png")}
            style={styles.confirmIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.fillerView}></View>
    </View>
  );
}
