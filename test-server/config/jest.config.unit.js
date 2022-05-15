const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  name: 'server-unit',
  displayName: 'Server unit tests',
  clearMocks: true,
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.env.setup.ts'], // load .env.test, .env.test.local, db...
  setupFilesAfterEnv: ['<rootDir>/test-server/singleton.ts'],
  testMatch: [
    '<rootDir>/tests-api/unit/**/*.test.ts', // whitelist only
  ],
};
