import { View, Image, Text, TouchableOpacity } from "react-native";
import { styles } from "../../assets/styles/Collection/collection.styles";
import { router } from "expo-router";
import { Button } from "@react-navigation/elements";
type InsectSectionProps = {
  idInsekta: number;
  nazivInsekta: string;
  potSlike: string | undefined;
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
              source={{ uri: props.potSlike }} 
              style={styles.insectSectionImage}
            />
          </View>
          <View style={styles.insectSectionInfoContainer}>
            <View style={styles.ujetBadge}>
                <Text style={styles.ujetText}>Ujet</Text>
            </View>
            <Text style={styles.insectName}>{props.nazivInsekta}</Text>
            <View style={styles.observationDetailSection}>
              <Image
                source={require("../../assets/icons/cas_icon.png")}
                style={styles.detailImage}
              />
              <Text style={styles.observationCas}>{props.cas}</Text>
            </View>
            <View style={styles.observationDetailSection}>
              <Image
                source={require("../../assets/icons/lokacija_icon.png")} 
                style={styles.detailImage}
              />
              <Text style={styles.observationLocation}>{props.lokacija}</Text>
            </View>
            <TouchableOpacity style={styles.preglejButton} onPress={() => router.push({pathname: '/collection/rod', params: {rodId: props.idInsekta}})}>
              <Text style={styles.preglejText}>Preglej →</Text>
            </TouchableOpacity>
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
