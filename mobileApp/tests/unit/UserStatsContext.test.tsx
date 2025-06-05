import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { UserStatsProvider, useUserStats } from '@/modules/gamification/contexts/UserStatsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const TestComponent = () => {
  const { xp, level, progress, levelUp, setStats } = useUserStats();

  React.useEffect(() => {
    setStats({ xp: 100, level: 2, progress: 50, levelUp: true });
  }, []);

  return (
    <>
      <Text testID="xp">{xp}</Text>
      <Text testID="level">{level}</Text>
      <Text testID="progress">{progress}</Text>
      <Text testID="levelUp">{levelUp ? 'true' : 'false'}</Text>
    </>
  );
};

describe('UserStatsProvider', () => {
  it('posodobi context pravilno prek setStats', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <UserStatsProvider>
        <TestComponent />
      </UserStatsProvider>
    );

    await waitFor(() => {
      expect(getByTestId('xp').props.children).toBe(100);
      expect(getByTestId('level').props.children).toBe(2);
      expect(getByTestId('progress').props.children).toBe(50);
      expect(getByTestId('levelUp').props.children).toBe('true');
    });
  });

  it('prebere začetne vrednosti iz AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'user_xp') return Promise.resolve('150');
      if (key === 'user_level') return Promise.resolve('3');
      return Promise.resolve(null);
    });

    const TestReadComponent = () => {
      const { xp, level } = useUserStats();
      return (
        <>
          <Text testID="xp">{xp}</Text>
          <Text testID="level">{level}</Text>
        </>
      );
    };

    const { getByTestId } = render(
      <UserStatsProvider>
        <TestReadComponent />
      </UserStatsProvider>
    );

    await waitFor(() => {
      expect(getByTestId('xp').props.children).toBe(150);
      expect(getByTestId('level').props.children).toBe(3);
    });
  });
});
