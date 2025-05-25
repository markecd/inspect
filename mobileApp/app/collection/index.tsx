import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { styles } from "../../assets/styles/Collection/collection.styles";
import RedCard from "../../components/Collection/RedCard";
import { openDatabase } from "@/services/database";
import { ScrollView } from "react-native-gesture-handler";

type RedRow = { naziv_reda: string };
type RedCardData = {
  red: string;
  image: any;
};

const getImageForRed = (naziv: string) => {
  const map: Record<string, any> = {
    "Bogomolke": require("../../assets/icons/Bogomolke_icon.png"),
    "Dvokrilci": require("../../assets/icons/Dvokrilci_icon.png"),
    "Hrošči": require("../../assets/icons/Hrošči_icon.png"),
    "Kačji pastirji": require("../../assets/icons/Kačji pastirji_icon.png"),
    "Kobilice": require("../../assets/icons/Kobilice_icon.png"),
    "Kožekrilci": require("../../assets/icons/Kožekrilci_icon.png"),
    "Metulji": require("../../assets/icons/Metulji_icon.png"),
    "Polkrilci": require("../../assets/icons/Polkrilci_icon.png"),
  };

  return map[naziv] ?? require("../../assets/icons/deny_icon.png");
};

export default function CollectionPage() {
  const [redi, setRedi] = useState<null | RedCardData[]>(null);
  useEffect(() => {
    (async () => {
      const db = await openDatabase();
      const result = db.getAllSync<RedRow>(
        `
                SELECT RED.naziv_reda
                FROM RED
            `
      );

      const redi: RedCardData[] = result.map((item) => ({
        red: item.naziv_reda,
        image: getImageForRed(item.naziv_reda),
      }));
      setRedi(redi);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {redi?.map((item, index) => (
          <RedCard key={index} red={item.red} image={item.image}></RedCard>
        ))}
      </ScrollView>
    </View>
  );
}
