import { openDatabase } from "@/services/database";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export const getImageForAchievement = (naziv: string) => {
  const map: Record<string, any> = {
    "Prva žuželka": require("../assets/icons/Bogomolke_icon.png"),
    "Vsestranski opazovalec": require("../assets/icons/Dvokrilci_icon.png"),
    "Izkušen iskalec": require("../assets/icons/Hrošči_icon.png"),
    Metuljkar: require("../assets/icons/Kačji pastirji_icon.png"),
    "Ljubitelj hroščev": require("../assets/icons/Kobilice_icon.png"),
    "Kačji opazovalec": require("../assets/icons/Kožekrilci_icon.png"),
    Znanstvenik: require("../assets/icons/Metulji_icon.png"),
    "Entomolog začetnik": require("../assets/icons/Polkrilci_icon.png"),
    Opazovalec: require("../assets/icons/Polkrilci_icon.png"),
  };

  return map[naziv] ?? require("../assets/icons/deny_icon.png");
};

export async function getAchievementName(achievementId: number) {
  const db = await openDatabase();
  const result = await db.getFirstAsync<{ naziv: string }>(
    `SELECT d.naziv
           FROM DOSEZEK d
           WHERE d.id = ?`,
    [achievementId]
  );
  return result?.naziv ?? "Neznan dosežek";
}

export async function getAchievementDescription(achievementId: number) {
  const db = await openDatabase();
  const result = await db.getFirstAsync<{ opis: string }>(
    `SELECT d.opis
           FROM DOSEZEK d
           WHERE d.id = ?`,
    [achievementId]
  );
  return result?.opis ?? "Neznan dosežek";
}

