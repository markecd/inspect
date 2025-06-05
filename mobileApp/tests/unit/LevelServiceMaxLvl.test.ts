import { checkLevel } from "@/modules/gamification/services/LevelService";


let mockGetFirstSync: jest.Mock;
let mockRunSync: jest.Mock;


jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));


jest.mock("@/services/database", () => ({
  openDatabase: async () => ({
    getFirstSync: mockGetFirstSync,
    runSync: mockRunSync,
  }),
}));

beforeEach(() => {
  mockGetFirstSync = jest.fn();
  mockRunSync = jest.fn();
  jest.clearAllMocks();
});

it("ne preseže maksimalnega levela (4)", async () => {

  mockGetFirstSync.mockReturnValue({ level: 3 });

  const result = await checkLevel(1, 1500); 

  expect(mockRunSync).toHaveBeenCalledWith(
    "UPDATE UPORABNIK SET level = ? WHERE id = ?",
    [4, 1]
  );

  expect(result.level).toBe(4);
  expect(result.levelUp).toBe(true);
  expect(result.progress).toBe(1500 % 250); // 0
});
