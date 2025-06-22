/**
 * @type {import('jest').Config}
 */
module.exports = {
  preset: "@repo/jest-config",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // Handle CSS imports
    "\\.css$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.json",
      },
    ],
  },
  setupFilesAfterEnv: ["@repo/jest-config/jest.setup.js"],
  testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};
