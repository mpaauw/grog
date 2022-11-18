module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/tests/globalSetup.js',
  testTimeout: 60000,
  // coverageThreshold: {
  //   global: {
  //     statements: 70,
  //     branch: 70,
  //     functions: 70,
  //     lines: 70
  //   }
  // }
};
