const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'Server integration tests',
  clearMocks: true,
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.env.setup.ts'], // load .env.test, .env.test.local, db...
  testMatch: [
    '<rootDir>/tests-api/integration/**/*.test.ts', // whitelist only
  ],
};
