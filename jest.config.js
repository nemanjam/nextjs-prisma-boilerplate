/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleDirectories: ['<rootDir>', 'node_modules'], // fixes baseUrl absolute imports
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.jest.json',
    },
  },
  setupFiles: ['jsdom-worker'], // defines URL.createObjectURL
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/dist/',
    '<rootDir>/notes/',
  ],
  /*
  // todo
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  */
};
