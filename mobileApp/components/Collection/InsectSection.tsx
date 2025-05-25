import { View, Image, Text, TouchableOpacity } from "react-native";
import { styles } from "../../assets/styles/Collection/collection.styles";
import { router } from "expo-router";
import { Button } from "@react-navigation/elements";
type InsectSectionProps = {
  nazivInsekta: string;
  potSlike: string | null;
  lokacija: string | null;
  cas: string | null;
  najdeno: number;
  nahajalisce: string;
};

const InsectSection = (props: InsectSectionProps) => {
  return (
    <View style={styles.insectSectionContainer}>
      {props.najdeno == 1 ? (
        <>
          <View style={styles.insectSectionImageContainer}>
            <Image
              source={require("../../assets/images/111.jpg")}
              style={styles.insectSectionImage}
            />
          </View>
          <View style={styles.insectSectionInfoContainer}>
            <Text style={styles.insectName}></Text>
            <Text style={styles.observationCas}></Text>
            <Text style={styles.observationLocation}></Text>
            <TouchableOpacity></TouchableOpacity>
          </View>
        </>
      ) : (
        <>
        <View style={styles.insectSectionImageContainer}>
            <Image
              source={require("../../assets/icons/unknown_icon.png")}
              style={styles.insectSectionImage}
            />
          </View>
          <View style={styles.insectSectionInfoContainer}>
            <Text style={styles.insectName}>{props.nazivInsekta}</Text>
            <Text style={styles.insectNahajalisce}>{props.nahajalisce}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default InsectSection;
