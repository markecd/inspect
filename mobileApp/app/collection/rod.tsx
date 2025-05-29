import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useEffect, useState, useRef } from "react";
import { styles } from "../../assets/styles/Collection/collection.styles";
import { openDatabase } from "@/services/database";
import { ScrollView } from "react-native-gesture-handler";
import { router, useLocalSearchParams } from "expo-router";
import Comments from "@/components/Observation/Comments";

type InsectDataRow = {
  id: number;
  naziv_rodu: string;
  latinski_naziv_rodu: string;
  opis_rodu: string;
  lokacija: string;
  cas: string;
  pot_slike: string;
  naziv_druzine: string;
  naziv_reda: string;
};

export default function RodPage() {
  const { rodId } = useLocalSearchParams();
  const [rod, setRod] = useState<InsectDataRow | null>(null);

  useEffect(() => {
    (async () => {
      const db = await openDatabase();
      const result = await db.getFirstAsync<InsectDataRow>(
        `
                                SELECT o.id, r.naziv_rodu, r.latinski_naziv_rodu, r.opis_rodu, o.lokacija, o.cas, o.pot_slike, d.naziv_druzine, re.naziv_reda
                                FROM ROD r 
                                JOIN OPAZANJE o ON r.id = o.TK_rod
                                JOIN DRUZINA d ON r.TK_DRUZINA = d.id
                                JOIN RED re ON d.TK_RED = re.id
                                WHERE r.id = ?
                            `,
        [Number(rodId)]
      );
      setRod(result);
    })();
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"height"}
      keyboardVerticalOffset={110}>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.rodContentContainer}>
        <View style={styles.rodNazivZuzelkeWrapper}>
          <Text style={styles.rodImeZuzelke}>{rod?.naziv_rodu}</Text>
          <Text style={styles.rodLatinskoImeZuzelke}>
            ({rod?.latinski_naziv_rodu})
          </Text>
        </View>
        <View style={styles.rodMainInfoOuterContainer}>
          <View style={styles.rodImageContainer}>
            <Image source={{ uri: rod?.pot_slike }} style={styles.rodImage} />
          </View>
          <View style={styles.rodMainInfoContainer}>
            <View style={styles.dateLocationWrapper}>
              <Image
                source={require("../../assets/icons/cas_icon.png")}
                style={styles.dateLocationIcon}
              />
              <Text style={styles.dateLocationText}>{rod?.cas}</Text>
            </View>
            <View style={styles.dateLocationWrapper}>
              <Image
                source={require("../../assets/icons/lokacija_icon.png")}
                style={styles.dateLocationIcon}
              />
              <Text style={styles.dateLocationText}>{rod?.lokacija}</Text>
            </View>
            <TouchableOpacity style={styles.askBuggyButton} onPress={() => router.push({pathname: '/collection/chat', params: {rodId: rodId, rodNaziv: rod?.naziv_rodu}})}>
              <Text style={styles.askBuggyText}>Vprašaj Buggy-ja!</Text>
              <Image
                source={require("../../assets/icons/Buggy_icon.png")}
                style={styles.buggyIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rodTaxonomyContainer}>
          <View style={styles.taxonomyDataContainer}>
            <View style={styles.taxonomyRedContainer}>
              <Text style={styles.taxonomyRedText}>Red: {rod?.naziv_reda}</Text>
            </View>
            <View style={styles.taxonomyRedContainer}>
              <Text style={styles.taxonomyRedText}>Družina: {rod?.naziv_druzine}</Text>
            </View>
            <View style={styles.taxonomyRedContainer}>
              <Text style={styles.taxonomyRedText}>Rod: {rod?.naziv_rodu}</Text>
            </View>
          </View>
          <Image
            source={require("../../assets/icons/taxonomy_icon.png")}
            style={styles.taxonomyImage}
          />
        </View>
        <View style={styles.rodDescriptionContainer}>
            <Text style={styles.rodDescriptionText}>{rod?.opis_rodu}</Text>
        </View>
        {rod?.id && <Comments observationId={rod.id} />}
      </ScrollView>

    </View>
    </KeyboardAvoidingView>
  );
}
