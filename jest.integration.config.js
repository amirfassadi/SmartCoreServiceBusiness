const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testPathIgnorePatterns: [],
  testMatch: ['**/integration/**/*.integration.spec.ts'],
};