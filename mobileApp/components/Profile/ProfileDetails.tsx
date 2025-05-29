import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../../assets/styles/Profile/profile-details.style";
import { auth, signOut } from "../../modules/auth/firebase/auth";
import { openDatabase } from "../../services/database";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { levelIconMap } from "@/modules/gamification/utils/achievementUtils";

type Props = {
  friendId?: number; 
};

export default function ProfileDetails({ friendId }: Props) {
  const [user, setUser] = useState<any>(null);;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("local_user_id");
      router.replace("/auth/login");
    } catch (error) {
      console.error("Napaka pri odjavi:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const db = await openDatabase();

        let userId: number;

        if (friendId !== undefined) {
          userId = friendId;
        } else {
          const localUserIdStr = await AsyncStorage.getItem("local_user_id");
          if (!localUserIdStr) {
            console.warn("local_user_id ni najden v AsyncStorage.");
            return;
          }
          userId = parseInt(localUserIdStr);
        }

        const result = db.getFirstSync<any>(
          `SELECT u.username, u.level, u.xp, COUNT(DISTINCT ud.id) as dosezki, COUNT(DISTINCT o.id) as opazanja 
           FROM UPORABNIK u
           LEFT JOIN UPORABNIK_DOSEZEK ud ON u.id = ud.tk_uporabnik
           LEFT JOIN OPAZANJE o ON u.id = o.TK_uporabnik
           WHERE u.id = ?`,
          [userId]
        );

        if (result) {
          setUser(result);
        } else {
          console.warn("Uporabnik ni v lokalni bazi.");
        }
      } catch (err) {
        console.error("Napaka pri branju iz baze:", err);
      }
    };

    fetchUser();
  }, [friendId]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Nalaganje profila...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.odjavaButton}>
        <Text style={styles.logoutText}>Odjava</Text>
      </TouchableOpacity>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Text style={styles.username}>{user.username}</Text>
        <Image style={styles.levelIcon} source={levelIconMap[user.level]}/>
      </View>
      <View style={styles.infoBox}>
        <View style={styles.infoBoxValues}>
          <Text style={styles.value}>{user.opazanja}</Text>
          <Text style={styles.value}>{user.xp}</Text>
          <Text style={styles.value}>{user.dosezki}</Text>
        </View>
        <View style={styles.infoBoxLabels}>
          <Text style={styles.label}>opažanj</Text>
          <Text style={styles.label}>točk</Text>
          <Text style={styles.label}>dosežkov</Text>
        </View>
      </View>
    </View>
  );
}
