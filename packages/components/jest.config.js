module.exports = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  verbose: true,
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect"
  ]
};
