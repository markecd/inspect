import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from '@/services/database';
import styles from '../../assets/styles/Profile/profile-details.style';
import { router } from "expo-router";

type Props = {
  friendId?: number;
};

export default function CollectionDetails({ friendId }: Props) {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      const db = await openDatabase();

      let userId: number;

      if (typeof friendId === 'number') {
        userId = friendId;
      } else {
        const localUserIdStr = await AsyncStorage.getItem('local_user_id');
        if (!localUserIdStr) {
          console.warn('local_user_id not found');
          return;
        }
        userId = parseInt(localUserIdStr);
      }

      const debug = db.getAllSync<any>(
        `SELECT TK_rod, TK_uporabnik FROM OPAZANJE WHERE TK_uporabnik = ?`,
        [userId]
      );

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
        const ratio = item.skupno_rodov > 0 ? item.najdenih_rodov / item.skupno_rodov : 0;
        const stars = Math.round(ratio * 4);
        return { ...item, stars };
      });

      setCollections(dataWithStars);
      setLoading(false);
    };

    fetchCollections();
  }, [friendId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Nalagam kolekcije...</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerDosezki}>
      <Text style={styles.heading}>Kolekcije</Text>

            <FlatList
                data={collections}
                keyExtractor={(item) => item.red_id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => router.push({pathname: '/collection/red', params: {red: item.naziv_reda}})}>
                        <Image
                            source={getCollectionIcon(item.naziv_reda)}
                            style={styles.achievementIcon}
                        />
                        <View style={styles.starsWrapper}>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Image
                                    key={i}
                                    source={
                                        i < item.stars
                                            ? require("../../assets/icons/star_icon.png")
                                            : require("../../assets/icons/star_empty_icon.png")
                                    }
                                    style={styles.starIcon}
                                />
                            ))}
                        </View>

                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

function getCollectionIcon(naziv: string) {
  switch (naziv) {
    case 'Hrošči':
      return require('../../assets/icons/Hrošči_icon.png');
    case 'Metulji':
      return require('../../assets/icons/Metulji_icon.png');
    case 'Kobilice':
      return require('../../assets/icons/Kobilice_icon.png');
    case 'Bogomolke':
      return require('../../assets/icons/Bogomolke_icon.png');
    case 'Dvokrilci':
      return require('../../assets/icons/Dvokrilci_icon.png');
    case 'Kačji pastirji':
      return require('../../assets/icons/Kačji pastirji_icon.png');
    case 'Kožekrilci':
      return require('../../assets/icons/Kožekrilci_icon.png');
    case 'Polkrilci':
      return require('../../assets/icons/Polkrilci_icon.png');
  }
}
