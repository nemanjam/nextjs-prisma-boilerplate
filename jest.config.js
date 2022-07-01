/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  projects: [
    '<rootDir>/test-client/config/jest.config.js',
    '<rootDir>/test-server/config/jest.config.unit.js',
    '<rootDir>/test-server/config/jest.config.integration.js',
  ],
  // coverage must be set up in this file
  // and run all tests at once
  collectCoverageFrom: [
    // include
    'components/**/*.{ts,tsx}',
    'layouts/**/*.{ts,tsx}',
    'lib-client/**/*.{ts,tsx}',
    'lib-server/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}',
    // ignore, must come after
    '!node_modules',
    '!.next',
    '!dist',
    '!prisma',
    '!themes',
    '!test-client',
    '!test-server',
    '!tests-api',
    '!tests-e2e',
    '!notes',
    '!server',
  ],
  // this is default, can be undefined
  coverageDirectory: 'coverage',
  /*
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
