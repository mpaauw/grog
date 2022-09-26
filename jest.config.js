module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/tests/globalSetup.js',
  testTimeout: 60000,
  coverageThreshold: {
    global: { // TODO: set min coverage limits after poc finished
      statements: 0,
      branch: 0,
      functions: 0,
      lines: 0
    }
  }
};
