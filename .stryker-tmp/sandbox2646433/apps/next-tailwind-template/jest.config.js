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
    "^@/(.*)$": "<rootDir>/$1",
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
  testMatch: ["<rootDir>/**/*.test.(ts|tsx)"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/**/*.d.ts",
    "!app/layout.tsx",
  ],
  // Next.js specific settings
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
};

export default config;
