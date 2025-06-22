/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "pnpm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "jest",
  coverageAnalysis: "perTest",
  jest: {
    projectType: "custom",
    configFile: "<rootDir>/jest.config.js",
    enableFindRelatedTests: true,
  },
  tsconfigFile: "<rootDir>/tsconfig.json",
  checkers: ["typescript"],
  mutate: [
    "src/**/*.ts?(x)",
    "!src/**/*.test.ts?(x)",
    "!src/**/*.spec.ts?(x)",
    "!src/**/*.d.ts",
    "!src/**/*.stories.ts?(x)",
    "!src/**/index.ts?(x)",
  ],
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },
  timeoutMS: 60000,
  concurrency: 4,
  maxConcurrentTestRunners: 4,
};
