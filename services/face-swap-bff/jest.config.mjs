/** @type {import('jest').Config} */
const config = {
  rootDir: ".",

  preset: "ts-jest/presets/js-with-ts-esm",

  testEnvironment: "node",

  clearMocks: true,

  collectCoverageFrom: ["src/**/*.{js,ts}"],

  coverageDirectory: "coverage",

  testMatch: ["**/*.test.{js,ts}"],

  verbose: true,

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  moduleNameMapper: {
    "^(.*)\\.js$": "$1",
  },

  extensionsToTreatAsEsm: [".ts"],

  moduleFileExtensions: ["ts", "js", "json", "node"],
};

export default config;
