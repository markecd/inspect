import { openDatabase } from "@/services/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function addXp(xp: number) {
  const userId = Number(await AsyncStorage.getItem("local_user_id"));
  const db = await openDatabase();
  const result = db.getFirstSync<{ xp: number }>(
    `UPDATE UPORABNIK SET xp = xp + ? WHERE id = ? RETURNING xp`,
    [Number(xp), userId]
  );

  const totalXp = result?.xp ?? 0;
  AsyncStorage.setItem("user_xp", totalXp.toString());

  return checkLevel(userId, totalXp);
}

export async function checkLevel(userId: number, xp: number) {
  const db = await openDatabase();
  const result = db.getFirstSync<{ level: number }>(
    `SELECT level FROM UPORABNIK WHERE id = ?`,
    [userId]
  );

  let currentLevel = result?.level ?? 1;
  const levelToBe = Math.min(Math.ceil(xp / 250), 4);

  let levelChanged = false;
  if (levelToBe !== currentLevel) {
    db.runSync(`UPDATE UPORABNIK SET level = ? WHERE id = ?`, [
      levelToBe,
      userId,
    ]);
    levelChanged = true;
    currentLevel = levelToBe;
  }

  AsyncStorage.setItem("user_level", currentLevel.toString());

  return { xp, progress: xp % 250, levelUp: levelChanged, level: currentLevel};
}
