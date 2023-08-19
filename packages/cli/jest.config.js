module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  setupFilesAfterEnv: ['./jest.setup.ts']
}
