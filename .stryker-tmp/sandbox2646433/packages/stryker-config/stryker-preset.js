/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  // Base configuration that can be extended by individual packages
  packageManager: "pnpm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "jest",
  coverageAnalysis: "perTest",
  jest: {
    projectType: "custom",
    enableFindRelatedTests: true,
  },
  checkers: ["typescript"],
  mutate: [
    "src/**/*.ts?(x)",
    "!src/**/*.test.ts?(x)",
    "src/*.ts?(x)",
    "!src/*.test.ts?(x)",
  ],
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },
};
