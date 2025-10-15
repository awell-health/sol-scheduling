/** @type {import('ts-jest').JestConfigWithTsJest} */

// Make sure jest runs with UTC TZ (to avoid failed tests locally)
process.env.TZ = 'UTC';

module.exports = {
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/.yarn'],
  testPathIgnorePatterns: ['\\.spec\\.ts$'],
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  }
};
