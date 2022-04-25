const { resolve } = require('path');
const baseConfig = require('../../jest.config.base');

const root = resolve(__dirname, '../..');

module.exports = {
  ...baseConfig,
  name: 'client',
  displayName: 'Client tests',
  rootDir: root,
  testEnvironment: 'jsdom',
  setupFiles: ['jsdom-worker', '<rootDir>/jest.env.setup.ts'], // defines URL.createObjectURL
  setupFilesAfterEnv: ['<rootDir>/test-client/config/jest.setup.ts'],
};
