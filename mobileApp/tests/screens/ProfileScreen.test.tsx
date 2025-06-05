import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';


const MockedProfileDetails = () => <Text>Mocked ProfileDetails</Text>;
const MockedCollectionDetails = () => <Text>Mocked CollectionDetails</Text>;
const MockedAchievementsDetails = () => <Text>Mocked AchievementsDetails</Text>;

jest.mock('@/components/Profile/ProfileDetails', () => () => MockedProfileDetails());
jest.mock('@/components/Profile/CollectionDetails', () => () => MockedCollectionDetails());
jest.mock('@/components/Profile/AchievementsDetails', () => () => MockedAchievementsDetails());


jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({}),
}));

import ProfileScreen from '@/app/profile/index';

describe('ProfileScreen', () => {
  it('ujema se s snapshotom', () => {
    const tree = render(<ProfileScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
