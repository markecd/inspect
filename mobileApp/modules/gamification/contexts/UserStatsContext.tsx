import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type UserStats = {
  xp: number;
  level: number;
  progress: number;
  levelUp: boolean;
  setStats: (stats: Partial<UserStats>) => void;
};

const UserStatsContext = createContext<UserStats | undefined>(undefined);

export const UserStatsProvider = ({ children }: { children: ReactNode }) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [levelUp, setLevelUp] = useState(false);

  const setStats = (stats: Partial<UserStats>) => {
    if (stats.xp !== undefined) setXp(stats.xp);
    if (stats.level !== undefined) setLevel(stats.level);
    if (stats.progress !== undefined) setProgress(stats.progress);
    if (stats.levelUp !== undefined) setLevelUp(stats.levelUp);
  };

  useEffect(() => {
    (async () => {
      const storedXp = await AsyncStorage.getItem("user_xp");
      const storedLevel = await AsyncStorage.getItem("user_level");
      if (storedXp !== null) setXp(Number(storedXp));
      if (storedLevel !== null) setLevel(Number(storedLevel));
    })();
  }, []);

  return (
    <UserStatsContext.Provider
      value={{ xp, level, progress, levelUp, setStats }}
    >
      {children}
    </UserStatsContext.Provider>
  );
};

export const useUserStats = () => {
  const context = useContext(UserStatsContext);
  if (!context)
    throw new Error("useUserStats must be used within UserStatsProvider");
  return context;
};
