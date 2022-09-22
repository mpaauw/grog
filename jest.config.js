module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/tests/globalSetup.js',
  testTimeout: 60000,
  coverageThreshold: {
    global: {
      statements: 90,
      branch: 90,
      functions: 90,
      lines: 90
    }
  }
};
