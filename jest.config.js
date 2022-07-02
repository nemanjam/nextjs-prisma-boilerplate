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
    // include -----------------------
    // client code
    'layouts/**/*.{ts,tsx}',
    'views/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    // client hooks
    'lib-client/**/*.{ts,tsx}',
    // server code
    'lib-server/**/*.{ts,tsx}',
    // client + server
    'pages/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    // ignore, must come after -------
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
    '!types',
  ],
  // this is default, can be undefined
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25,
    },
  },
};
