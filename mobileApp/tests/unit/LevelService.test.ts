import AsyncStorage from "@react-native-async-storage/async-storage";


jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockGetFirstSync = jest.fn();
const mockRunSync = jest.fn();

jest.mock("@/services/database", () => ({
  openDatabase: async () => ({
    getFirstSync: mockGetFirstSync,
    runSync: mockRunSync,
  }),
}));

import { addXp, checkLevel } from "@/modules/gamification/services/LevelService";

describe("checkLevel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ne spremeni levela, če XP ne presega praga", async () => {
    mockGetFirstSync.mockReturnValue({ level: 1 });

    const result = await checkLevel(1, 100);

    expect(mockRunSync).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("user_level", "1");
    expect(result).toEqual({
      xp: 100,
      progress: 100,
      levelUp: false,
      level: 1,
    });
  });

  it("posodobi level, če XP preseže prag", async () => {
    mockGetFirstSync.mockReturnValue({ level: 1 });

    const result = await checkLevel(1, 600); 

    expect(mockRunSync).toHaveBeenCalledWith(
      "UPDATE UPORABNIK SET level = ? WHERE id = ?",
      [3, 1]
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("user_level", "3");
    expect(result).toEqual({
      xp: 600,
      progress: 600 % 250, 
      levelUp: true,
      level: 3,
    });
  });
});

describe("addXp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("1"); 
  });

  it("poveča XP in shrani podatke", async () => {
    mockGetFirstSync.mockReturnValue({ xp: 150 }); 
    const mockCheckLevel = jest.fn().mockResolvedValue({
      xp: 150,
      progress: 150,
      levelUp: false,
      level: 1,
    });

    
    const originalCheckLevel = jest.requireActual(
      "@/modules/gamification/services/LevelService"
    ).checkLevel;

    
    const realCheckLevel = checkLevel;
    (global as any).checkLevel = mockCheckLevel;

    const result = await addXp(50);

    expect(mockGetFirstSync).toHaveBeenCalledWith(
      "UPDATE UPORABNIK SET xp = xp + ? WHERE id = ? RETURNING xp",
      [50, 1]
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("user_xp", "150");

    
    (global as any).checkLevel = originalCheckLevel;

   
    expect(result).toEqual({
      xp: 150,
      progress: 150,
      levelUp: false,
      level: 1,
    });
  });
});
