module.exports = {
  rootDir: __dirname,
  preset: 'ts-jest',
  moduleDirectories: ['<rootDir>', 'node_modules'], // fixes baseUrl absolute imports
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.jest.json',
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/dist/',
    '<rootDir>/notes/',
  ],
};
