import { View, Image, Text, TouchableOpacity } from "react-native";
import { styles } from "../../assets/styles/Collection/collection.styles";
import { router } from "expo-router";
import InsectSection from "./InsectSection";
type DruzinaSectionProps = {
  imeDruzine: string;
  insects: {
    cas: string | null;
    lokacija: string | null;
    nahajalisce_rodu: string;
    najdeno: number;
    naziv_druzine: string;
    naziv_rodu: string;
    pot_slike: string | null;
  }[];
};

const DruzinaSection = (props: DruzinaSectionProps) => {
  return (
    <View style={styles.druzinaSectionContainer}>
      <Text style={styles.druzinaSectionText}>{props.imeDruzine}</Text>
      {props.insects.map((item, index) => (
        <InsectSection
          key={index}
          nazivInsekta={item.naziv_rodu}
          potSlike={item.pot_slike}
          lokacija={item.lokacija}
          cas={item.cas}
          najdeno={item.najdeno}
          nahajalisce={item.nahajalisce_rodu}
        />
      ))}
    </View>
  );
};

export default DruzinaSection;
