import { checkAchievements } from '@/modules/gamification/services/AchievementService';
import AsyncStorage from '@react-native-async-storage/async-storage';


jest.mock('expo-sqlite', () => ({
  openDatabase: () => ({
    getAllSync: jest.fn(),
    getFirstSync: jest.fn(),
    runSync: jest.fn(),
    runAsync: jest.fn(),
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockGetAllSync = jest.fn();
const mockRunSync = jest.fn();

jest.mock('@/services/database', () => ({
  openDatabase: async () => ({
    getAllSync: mockGetAllSync,
    runSync: mockRunSync,
  }),
}));

it('ignorira neveljaven ID dosežka in izpiše opozorilo', async () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue("1");

  mockGetAllSync.mockImplementationOnce(() => [{ id: 99 }]);
  mockGetAllSync.mockImplementationOnce(() => [{ id: 99, xp_vrednost: 10 }]);
  mockGetAllSync.mockImplementationOnce(() => []);

  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

  const result = await checkAchievements("opazanje");

  expect(result).toEqual({
    acomplishedAchievements: [],
    totalXp: 0,
  });

  expect(consoleWarnSpy).toHaveBeenCalledWith(
    "Achievement with id=99 not found in AllAchievements"
  );

  expect(mockRunSync).not.toHaveBeenCalled();

  consoleWarnSpy.mockRestore();
});
