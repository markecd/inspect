import { useUserStats } from "@/modules/gamification/contexts/UserStatsContext";
import { addXp } from "@/modules/gamification/services/LevelService";

export const useXpUpdater = () => {
  const { setStats } = useUserStats();

  const gainXp = async (amount: number) => {
    const result = await addXp(amount); 
    setStats(result); 
  };

  return gainXp;
};
