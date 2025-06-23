/**
 * @type {import('jest').Config}
 */
const config = {
  preset: "@repo/jest-config",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // Handle CSS imports
    "\\.css$": "identity-obj-proxy",
    // Handle module aliases
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          "@babel/preset-typescript",
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
      },
    ],
  },
  setupFilesAfterEnv: ["@repo/jest-config/jest.setup.js"],
  testMatch: ["<rootDir>/tests/**/*.test.(ts|tsx)"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/layout.tsx",
  ],
  // Next.js specific settings
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/.stryker-tmp/",
  ],
};

export default config;
