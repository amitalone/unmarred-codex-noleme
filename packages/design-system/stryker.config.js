/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  // Basic configuration
  packageManager: "pnpm",
  testRunner: "command",
  coverageAnalysis: "perTest",

  // Command runner configuration
  commandRunner: {
    command: 'pnpm test -- --testMatch="**/*.test.{ts,tsx}"',
    findRelatedTests: false,
  },

  // Explicitly specify the plugins to use
  plugins: ["@stryker-mutator/jest-runner"],

  // UI package specific file patterns
  mutate: ["src/**/**.tsx", "!src/**/**.test.tsx"],

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
