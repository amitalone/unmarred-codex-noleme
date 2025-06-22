/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  // Basic configuration
  packageManager: "pnpm",
  testRunner: "jest",
  coverageAnalysis: "perTest",

  // Explicitly specify the plugins to use
  plugins: ["@stryker-mutator/jest-runner"],

  // Jest configuration
  jest: {
    projectType: "custom",
    configFile: "./jest.config.js",
    enableFindRelatedTests: false,
  },

  // UI package specific file patterns
  mutate: ["src/**/*.tsx", "!src/**/*.test.tsx"],

  // UI package specific thresholds
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },

  // Performance settings
  timeoutMS: 60000,
  concurrency: 4,

  // Reporters
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation/html/index.html",
  },
};
