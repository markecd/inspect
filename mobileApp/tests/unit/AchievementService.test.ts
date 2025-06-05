import { checkAchievements } from '@/modules/gamification/services/AchievementService';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

import * as AchievementSystem from '@/modules/gamification/services/AchievementService';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('checkAchievements - kombiniran test', () => {
  it('dodeli več dosežkov hkrati glede na pogoje', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("1");

    
    mockGetAllSync.mockImplementationOnce(() => [
      { id: 1 }, 
      { id: 2 }, 
      { id: 4 }, 
      { id: 9 }, 
    ]);

    
    mockGetAllSync.mockImplementationOnce(() => [
      { id: 1, xp_vrednost: 10 },
      { id: 2, xp_vrednost: 20 },
      { id: 4, xp_vrednost: 30 },
      { id: 9, xp_vrednost: 40 },
    ]);

 
    mockGetAllSync.mockImplementationOnce(() => [
      { redId: 1, count: 1 }, 
      { redId: 2, count: 2 },
      { redId: 3, count: 5 }, 
    ]);

   
    mockGetAllSync.mockImplementationOnce(() => {
      return Array(10).fill({ komentarId: 1, count: 1 }); 
    });

    const result = await checkAchievements("opazanje"); 

    expect(result).toEqual({
      acomplishedAchievements: [1, 2, 4],
      totalXp: 60, 
    });

    expect(mockRunSync).toHaveBeenCalledTimes(3);
    expect(mockRunSync).toHaveBeenCalledWith(
      'INSERT INTO UPORABNIK_DOSEZEK (tk_uporabnik, tk_dosezek) VALUES (?,?)',
      [1, 1]
    );
    expect(mockRunSync).toHaveBeenCalledWith(
      'INSERT INTO UPORABNIK_DOSEZEK (tk_uporabnik, tk_dosezek) VALUES (?,?)',
      [1, 2]
    );
    expect(mockRunSync).toHaveBeenCalledWith(
      'INSERT INTO UPORABNIK_DOSEZEK (tk_uporabnik, tk_dosezek) VALUES (?,?)',
      [1, 4]
    );
  });
});
