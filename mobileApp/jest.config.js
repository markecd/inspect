module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@react-navigation|@firebase|firebase|@react-native-async-storage|expo|@expo|@react))',
      ],      
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
  };
  