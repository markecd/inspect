import { View, Text, TouchableOpacity, Image } from "react-native";
import { useEffect, useState, useRef } from "react";
import { styles } from "../../assets/styles/Observation/details.styles";
import { router, useLocalSearchParams } from "expo-router";
import labels from "../../assets/labels.json";
import { openDatabase } from "../../services/database";
import { ScrollView } from "react-native-gesture-handler";
import {
  getLocation,
  requestLocationPermission,
} from "@/services/LocationService";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkAchievements } from "@/modules/gamification/services/AchievementService";
import {
  getAchievementName,
  getImageForAchievement,
} from "@/modules/gamification/utils/achievementUtils";
import Toast from "react-native-toast-message";
import { useXpUpdater } from "@/hooks/useXpUpdater";
import { saveObservationInFirestore } from "@/services/syncService";

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
  const [photoPath, setPhotoPath] = useState<string>("");
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );
  const gainXp = useXpUpdater();
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    (async () => {
      const statusLocationPermission = await requestLocationPermission();
      setLocationPermission(statusLocationPermission == "granted");
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

  if (!locationPermission) {
    return <Text>Dovolite aplikaciji INSPECT uporabo lokacije.</Text>;
  }

  async function saveImage(photoPath: string) {
    const fileName = photoPath?.split("/").pop();
    const newPath = `${FileSystem.documentDirectory}photos/${fileName}`;

    const folderInfo = await FileSystem.getInfoAsync(
      `${FileSystem.documentDirectory}photos`
    );
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}photos`,
        { intermediates: true }
      );
    }

    await FileSystem.moveAsync({
      from: photoPath,
      to: newPath,
    });

    return newPath;
  }

  const runObservationTransaction = async (
    naziv: string,
    lokacijaShort: string,
    casString: string,
    imagePath: string,
    userId: number,
    rodId: number
  ) => {
    const db = await openDatabase();
    db.execSync("BEGIN TRANSACTION");
    try {
      db.runSync(
        `INSERT INTO OPAZANJE (naziv, lokacija, cas, pot_slike, TK_uporabnik, TK_rod) VALUES (?, ?, ?, ?, ?, ?)`,
        [naziv, lokacijaShort, casString, imagePath, userId, rodId]
      );

      db.runSync(`UPDATE ROD SET najdeno = 1 WHERE id = ?`, [rodId]);

      db.execSync("COMMIT");
    } catch (error) {
      db.execSync("ROLLBACK");
      console.error(error);
    }
  };

  async function saveObservation() {
    const numberRodId = Number(insectData?.id);
    const cas = new Date();
    const casString = `${cas.getDate()}. ${
      cas.getMonth() + 1
    }. ${cas.getFullYear()} - ${cas.toTimeString().split(" ")[0]}`;

    const lokacija = await getLocation();
    const lokacijaShort = lokacija.coords.latitude
      .toString()
      .concat(",", lokacija.coords.longitude.toString());
    const naziv = numberRodId
      .toString()
      .concat("-", casString)
      .concat(
        "-",
        lokacija.coords.latitude
          .toString()
          .concat(",", lokacija.coords.longitude.toString())
      );
    const imagePath = await saveImage(photoPath.toString());
    const userId = Number(await AsyncStorage.getItem("local_user_id"));
    const rodId = numberRodId;

    await runObservationTransaction(
      naziv,
      lokacijaShort,
      casString,
      imagePath,
      userId,
      rodId
    );

    saveObservationInFirestore(rodId, naziv, casString, lokacijaShort, imagePath);
  }

  const handleSaveObservation = async () => {
    try {
      await saveObservation();

      router.push("/collection");

      setTimeout(async () => {
        try {
          const achieved = await checkAchievements("opazanje");
          achieved.acomplishedAchievements.forEach(async (item) => {
            let name = await getAchievementName(item);
            let imagePath = getImageForAchievement(name);
            Toast.show({
              type: "achievementToast",
              props: {
                txt1: "Doseženo: ",
                txt2: name,
                txt3: imagePath,
                onPress: () => {
                  Toast.hide();
                  router.push("/achievements");
                },
              },
              visibilityTime: 3000,
            });
            await sleep(4000);
          });
          await gainXp(20 + achieved.totalXp);
        } catch (err) {
          console.error("Achievement check failed:", err);
        }
      }, 0);
    } catch (error) {
      console.error("error: ", error);
    }
  };

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
            <View>
            <Text style={styles.insectName}>{insectData?.naziv_rodu}</Text>
            <Text style={styles.insectScientificName}>
              {insectData?.latinski_naziv_rodu}
            </Text>
            </View>
            <View style={styles.taxonomyTree}>
              <View style={styles.taxonomyTextContainer}>
                <Text style={styles.insectOrderName}>{insectData?.red}</Text>
                <Text style={styles.insectFamilyName}>{insectData?.druzina}</Text>
                <Text style={styles.insectOrderName}>{insectData?.naziv_rodu}</Text>
              </View>
              <Image
                source={require("../../assets/icons/taxonomy_icon.png")}
                style={styles.arrowIcon}
              />
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
          onPress={handleSaveObservation}
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
