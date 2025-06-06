module.exports = {
  rootDir: './',
  testMatch: ['**/tests/e2e/**/*.e2e.{js,ts}'],
  testTimeout: 120000,
  setupFilesAfterEnv: ['detox/runners/jest/setup'], 
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
};
