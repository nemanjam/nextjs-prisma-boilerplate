const { configureNextJestPreview } = require('jest-preview');
const baseConfig = require('../../jest.config.base');

const jestConfig = {
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
  // remove when fixed in react-hook-form/resolvers/zod
  resolver: '<rootDir>/test-client/config/hook-form-resolver-fix.js',
};

module.exports = configureNextJestPreview(() => jestConfig);
