jest.mock('shelljs', () => ({
  cd: jest.fn(),
  exec: jest.fn(),
  test: jest.fn()
}))
