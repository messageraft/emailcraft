module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  verbose: true,
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect"
  ]
};
