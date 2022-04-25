const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  name: 'client',
  displayName: 'Client tests',
  testEnvironment: 'jsdom',
  setupFiles: ['jsdom-worker', '<rootDir>/jest.env.setup.ts'], // defines URL.createObjectURL
  setupFilesAfterEnv: ['<rootDir>/test-client/config/jest.setup.ts'],
  testMatch: [
    '<rootDir>/components/**/*.test.{ts,tsx}', // whitelist only
    '<rootDir>/lib-client/**/*.test.{ts,tsx}',
    '<rootDir>/views/**/*.test.{ts,tsx}',
  ],
};
