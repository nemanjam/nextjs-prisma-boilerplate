const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  name: 'server',
  displayName: 'Server tests',
  clearMocks: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test-server/singleton.ts'],
  testMatch: [
    '<rootDir>/api-tests/**/*.test.{ts,tsx}', // whitelist only
  ],
};
