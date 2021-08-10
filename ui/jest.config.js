module.exports = {
  // moduleDirectories: ["node_modules", "tests", __dirname],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.js",
    "<rootDir>/tests/mocks/setup-env.js",
    "<rootDir>/tests/mocks/mock-fetch.js",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  collectCoverageFrom: ["<rootDir>/pages/**/*.js"],
  testEnvironment: "jsdom",
};
