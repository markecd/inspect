import { openDatabase } from "@/services/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RodReds = {
  redId: number;
  count: number;
};
type Komentar = {
  komentarId: number;
  count: number;
};

type AchievementXPMap = Record<number, number>;
let achievements: AchievementXPMap = {};
function setAchievementsXp(map: AchievementXPMap) {
  achievements = map;
}
export async function getAchievementsXP() {
  const db = await openDatabase();
  const achievements = db.getAllSync<{ id: number; xp_vrednost: number }>(
    `   SELECT id, xp_vrednost
        FROM DOSEZEK 
    `
  );
  const xpMap: AchievementXPMap = {};
  achievements.forEach((row) => {
    xpMap[row.id] = row.xp_vrednost;
  });
  setAchievementsXp(xpMap);
}

interface Achievement {
  readonly id: number;
  readonly type: string;
  readonly xp: number;

  check(): boolean;
}

class PrvaZuzelkaAchievement implements Achievement {
  readonly id: number = 1;
  readonly type: string = "opazanje";
  readonly xp: number = achievements[this.id];

  check(): boolean {
    if (rodsReds.length > 0) return true;
    return false;
  }
}

class VsestranskiOpazovalecAchievement implements Achievement {
  readonly id: number = 2;
  readonly type: string = "opazanje";
  readonly xp: number = achievements[this.id];

  check(): boolean {
    let count = 0;
    for (let item of rodsReds) {
      count += item.count;
      if (count >= 3) {
        return true;
      }
    }
    return false;
  }
}

class IzkusenIskalecAchievement implements Achievement {
  readonly id: number = 3;
  readonly type: string = "opazanje";
  readonly xp: number = achievements[this.id];

  check(): boolean {
    let count = 0;
    for (let item of rodsReds) {
      count += item.count;
      if (count >= 30) {
        return true;
      }
    }
    return false;
  }
}

class MetuljkarAchievement implements Achievement {
  readonly id: number = 4;
  readonly type: string = "opazanje";
  readonly xp: number = achievements[this.id];

  check(): boolean {
    return rodsReds.some((item) => item.redId == 3 && item.count == 5);
  }
}

class LjubiteljHroscevAchievement implements Achievement {
  readonly id: number = 5;
  readonly type: string = "opazanje";
  readonly xp: number = achievements[this.id];

  check(): boolean {
    return rodsReds.some((item) => item.redId == 1 && item.count == 5);
  }
}

class KacjiOpazovalecAchievement implements Achievement {
  readonly id: number = 6;
  readonly type: string = "opazanje";
  readonly xp: number = achievements[this.id];

  check(): boolean {
    return rodsReds.some((item) => item.redId == 6 && item.count == 5);
  }
}

class ZnanstvenikAchievement implements Achievement {
  readonly id: number = 9;
  readonly type: string = "komentar";
  readonly xp: number = achievements[this.id];

  check(): boolean {
    if (komentars.length >= 10) return true;
    return false;
  }
}

class EntomologZacetnikAchievement implements Achievement {
  readonly id: number = 10;
  readonly type: string = "opazanje";
  readonly xp: number = achievements[this.id];

  check(): boolean {
    if (getRedsDiscovered().length < 8) return false;
    return true;
  }
}

class RodovniUcenjakAchievement implements Achievement {
  readonly id: number = 12;
  readonly type: string = "opazanje";
  readonly xp: number = achievements[this.id];

  check(): boolean {
    if (getRedsDiscovered.length < 3) return false;
    return true;
  }
}

class OpazovalecAchievement implements Achievement {
  readonly id: number = 13;
  readonly type: string = "opazanje";
  readonly xp: number = achievements[this.id];

  check(): boolean {
    let count = 0;
    for (let item of rodsReds) {
      count += item.count;
      if (count >= 10) {
        return true;
      }
    }
    return false;
  }
}

let rodsReds: RodReds[] = [];
let komentars: Komentar[] = [];

function setRodReds(rodReds: RodReds[]) {
  rodsReds = rodReds;
}
function setKomentarsOpazanje(komentars: Komentar[]) {
  komentars = komentars;
}
function getRedsDiscovered(): number[] {
  return rodsReds.map((item) => item.redId);
}

const AllAchievements: Record<number, { new (): Achievement }> = {
  1: PrvaZuzelkaAchievement,
  2: VsestranskiOpazovalecAchievement,
  3: IzkusenIskalecAchievement,
  4: MetuljkarAchievement,
  5: LjubiteljHroscevAchievement,
  6: KacjiOpazovalecAchievement,
  9: ZnanstvenikAchievement,
  10: EntomologZacetnikAchievement,
  12: RodovniUcenjakAchievement,
  13: OpazovalecAchievement,
};

export async function checkAchievements(
  eventType: string
): Promise<{ acomplishedAchievements: number[], totalXp: number }> {
  const userId = Number(await AsyncStorage.getItem("local_user_id"));
  const db = await openDatabase();
  const achievementsQuery = db.getAllSync<{ id: number }>(
    `   SELECT id 
            FROM DOSEZEK 
            WHERE id NOT IN (
                SELECT tk_dosezek 
                FROM UPORABNIK_DOSEZEK 
                WHERE tk_uporabnik = ?
            )`,
    [userId]
  );

  const achievementIds = achievementsQuery.map((row) => row.id);

  await getAchievementsXP();

  if (eventType == "opazanje") {
    await getDisctinctRodsForRed();
  } else if (eventType == "komentar") {
    await getKomentarsForDistinctReds();
  }

  const acomplished: AchievementXPMap = {};

  achievementIds.forEach((item) => {
    const AchievementClass = AllAchievements[item];
    if (!AchievementClass) {
      console.warn(`Achievement with id=${item} not found in AllAchievements`);
      return;
    }
    const achievementInstance = new AllAchievements[item]();
    if (achievementInstance.type == eventType) {
      if (achievementInstance.check()) {
        acomplished[achievementInstance.id] = achievementInstance.xp;
      }
    }
  });

  let acomplishedAchievements = [];
  let totalXp = 0;

  for (const [id, xp] of Object.entries(acomplished)) {
    acomplishedAchievements.push(Number(id));
    totalXp += xp;
    const db = await openDatabase();
    try {
      db.runSync(
        `INSERT INTO UPORABNIK_DOSEZEK (tk_uporabnik, tk_dosezek) VALUES (?,?)`,
        [userId, Number(id)]
      );

      
    } catch (error) {
      console.error(error);
    }
  }
  return {acomplishedAchievements, totalXp};
}

export async function getDisctinctRodsForRed() {
  try {
    const userId = Number(await AsyncStorage.getItem("local_user_id"));
    const db = await openDatabase();
    const countZuzelke = db.getAllSync<RodReds>(
      `SELECT d.TK_RED, o.TK_rod, COUNT(DISTINCT o.TK_rod) as count FROM OPAZANJE o JOIN ROD r ON o.TK_rod = r.id JOIN DRUZINA d ON r.TK_DRUZINA = d.id WHERE o.TK_UPORABNIK = ? GROUP BY d.TK_RED`,
      [userId]
    );

    setRodReds(countZuzelke);
  } catch (error) {
    console.error(error);
  }
}

export async function getKomentarsForDistinctReds() {
  try {
    const userId = Number(await AsyncStorage.getItem("local_user_id"));
    const db = await openDatabase();
    const countKomentar = db.getAllSync<Komentar>(
      `SELECT DISTINCT o.id as opazanje, COUNT(k.tk_opazanje) as count FROM KOMENTAR k JOIN OPAZANJE o ON k.tk_opazanje = o.id WHERE o.TK_UPORABNIK = ? GROUP BY o.id`,
      [userId]
    );

    setKomentarsOpazanje(countKomentar);
  } catch (error) {
    console.error(error);
  }
}
