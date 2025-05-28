import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import styles from "../../assets/styles/Header/header.style";
import { router } from "expo-router";
import { auth, signOut } from "../../modules/auth/firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStats } from "@/modules/gamification/contexts/UserStatsContext";
import { levelIconMap } from "@/modules/gamification/utils/achievementUtils";

export default function Header() {
  const { xp, level, progress, levelUp } = useUserStats();
  const [progressToDisplay, setProgressToDisplay] = useState(0);
  const handleUserIconPress = () => {
    router.push("/profile");
  };

  useEffect(()=> {
  
  if(xp == 0){
    setProgressToDisplay(0);
  }else{
  const progressA = xp % 250;
  setProgressToDisplay(progressA !== 0 ? (progressA * 100) / 25000 : 0.99)
  }
  },[xp])

  return (
    <View style={styles.container}>
      <Image source={levelIconMap[level]} style={styles.icon1} />
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressFill,
            { width: `${progressToDisplay * 100}%` },
          ]}
        />
      </View>
      <TouchableOpacity onPress={handleUserIconPress}>
        <Image
          source={require("../../assets/icons/user.png")}
          style={styles.icon2}
        />
      </TouchableOpacity>
    </View>
  );
}
