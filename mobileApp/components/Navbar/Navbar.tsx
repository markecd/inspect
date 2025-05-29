import { View, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import styles from '../../assets/styles/Navbar/navbar.style';
import { openDatabase } from '@/services/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getModelRespose } from '@/modules/llm/services/getResponseService';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const tabs = [
    { path: '/achievements', icon: require('../../assets/images/achievements.png'), style: styles.icon },
    { path: '/collection', icon: require('../../assets/images/collection.png'), style: styles.icon },
    { path: '/observation', icon: require('../../assets/images/scan.png'), style: styles.centerIcon },
    { path: '/friends', icon: require('../../assets/images/friends.png'), style: styles.icon },
    { path: '/profile', icon: require('../../assets/images/notifications.png'), style: styles.icon },
  ];

  const databaseClearance = async () => {
    const db = await openDatabase();

    try {
      db.execSync(`DELETE FROM OPAZANJE`);
      db.execSync(`DELETE FROM UPORABNIK_DOSEZEK`);
      db.execSync(`UPDATE ROD SET najdeno = 0 WHERE najdeno = 1`);
      db.execSync(`UPDATE UPORABNIK SET xp = 0, level = 1`);
      AsyncStorage.removeItem("user_xp");
      AsyncStorage.removeItem("user_level");
      console.log("✅ Database reset successfully.");
    } catch (error) {
      console.error("❌ Error during database clearance:", error);
    }
  };

  const checkLvl = async() => {
        const db = await openDatabase();
    const result = db.getAllSync(
      `
      SELECT * FROM UPORABNIK_DOSEZEK
      `
    )
    console.log(result)
  }

  const testLLM = async () => {
    const messages = [
  {
    role: "user",
    content: "Kaj mi lahko poveš o prehrani pikapolonice v slovenščini",
  },
  {
    role: "assistant",
    content:
      "Prehrana pikapolonice je zelo pomembna za njeno zdravje in rast. Pikapolonice so mesojedci, kar pomeni, da potrebujejo dieto, ki je bogata z beljakovinami in maščobami.\n\n**Prehrana pikapolonice:**\n\n1. **Žuželke**: Pikapolonice se hranijo z različnimi vrstami žuželk, kot so cvrčki, ščurki, muhe in komarji. Žuželke so bogate z beljakovinami in so pomembna vir energije za pikapolonice.\n2. **Ličinke**: Ličinke različnih vrst žuželk, kot so ličinke muh in komarjev, so tudi pomemben del prehrane pikapolonice.\n3. **Plenilci**: Pikapolonice se hranijo tudi z različnimi vrstami plenilcev, kot so miši, podgane in drugi majhni sesalci.\n4. **Sadje in zelenina**: Pikapolonice tudi jedo sadje in zelenino, kot so jagode, maline, korenje in listi.\n5. **Suplementi**: V ujetništvu se pikapolonicam dajejo suplementi, kot so vitamin D3 in kalcij, da bi zagotovili njihovo optimalno zdravje.\n\n**Prehranski zahtevi:**\n\n1. **Bela krovina**: Pikapolonice potrebujejo belo krovino, kot so cvrčki ali muhe, kot vir beljakovin.\n2. **Maščobe**: Pikapolonice potrebujejo maščobe, kot so korenje ali listi, za energijo.\n3. **Vitamin D3**: Pikapolonice potrebujejo vitamin D3 za uravnavanje kalcija in fosforja v telesu.\n4. **Kalcij**: Pikapolonice potrebujejo kalcij za rast in razvoj kosti.\n\n**Napake v prehrani:**\n\n1. **Prenizka prehrana**: Prenizka prehrana lahko povzroči oslabelost, slabo zdravje in smrt.\n2. **Nepravilna prehrana**: Nepravilna prehrana lahko povzroči nezdrave navade, kot so jedanje lastnega odpadka ali hrane, ki ni primerna za pikapolonice.\n3. **Pomanjkanje vitamina in mineralov**: Pomanjkanje vitamina in mineralov lahko povzroči težave z zdravjem, kot so krhke kosti ali slab okus.\n\nZaključek: Prehrana pikapolonice je zelo pomembna za njeno zdravje in rast. Pikapolonice potrebujejo dieto, ki je bogata z beljakovinami, maščobami, vitaminom D3 in kalcijem. Pomembno je tudi, da se pikapolonicam dajejo suplementi, kot so vitamin D3 in kalcij, da bi zagotovili njihovo optimalno zdravje.",
  },
  {
    role: "user",
    content: "O čem sva se pogovarjala odgovori na kratko",
  },
];

const result = await getModelRespose(messages);
console.log(typeof(result));

  }

  return (
    <View style={styles.container}>
      {tabs.map((tab, i) => (
        <TouchableOpacity key={i} onPress={
          () => router.push(tab.path)
          //testLLM
          }>
          <Image source={tab.icon} style={tab.style} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
