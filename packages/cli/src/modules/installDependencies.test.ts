let mockOra: ReturnType<typeof createMockOra>
const texts: string[] = []
const createMockOra = () => ({
  start: jest.fn(),
  set text(text: string) {
    texts.push(text)
  },
  succeed: jest.fn(),
  stopAndPersist: jest.fn(),
  fail: jest.fn()
})
jest.mock('ora', () => {
  mockOra = createMockOra()
  return () => mockOra
})

jest.mock('shelljs', () => ({
  cd: jest.fn(),
  exec: jest.fn(),
  test: jest.fn()
}))

jest.mock('../utils/closeOraOnSigInt')

import shell from 'shelljs'
import { installDependencies } from './installDependencies'
import { closeOraOnSIGNIT } from '../utils/closeOraOnSigInt'
import { PackageManager } from '../typings'

describe('installDependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(shell.test as jest.Mock).mockReturnValue(true)
    mockOra.start.mockImplementation(function (this: any) {
      return this
    })

    mockOra.succeed.mockImplementation(function (this: any) {
      return this
    })

    mockOra.stopAndPersist.mockImplementation(function (this: any) {
      return this
    })
  })

  it('should switch to the clientDir directory', () => {
    installDependencies({ packageManager: 'npm', clientDir: '/test/dir' })
    expect(shell.cd).toHaveBeenCalledWith('/test/dir')
  })

  it('should call the package manager install command', () => {
    installDependencies({ packageManager: 'npm', clientDir: '/test/dir' })
    expect(shell.exec).toHaveBeenCalledWith('npm install')
  })

  it('should display spinner messages', () => {
    installDependencies({ packageManager: 'npm', clientDir: '/test/dir' })

    expect(mockOra.start).toHaveBeenCalledWith('Installing dependencies...\n')
    expect(mockOra.stopAndPersist).toHaveBeenCalledWith({
      symbol: expect.anything(),
      text: 'Dependencies installed'
    })
  })

  it('should call closeOraOnSIGNIT', () => {
    installDependencies({ packageManager: 'npm', clientDir: '/test/dir' })
    expect(closeOraOnSIGNIT).toHaveBeenCalledWith(mockOra)
  })

  it('should throw an error if clientDir does not exist', () => {
    ;(shell.test as jest.Mock).mockReturnValueOnce(false)

    expect(() => {
      installDependencies({
        packageManager: 'npm',
        clientDir: '/non/existent/dir'
      })
    }).toThrow('Directory does not exist.')
  })

  it('should throw an error for an invalid package manager', () => {
    expect(() => {
      installDependencies({
        packageManager: 'invalidManager' as PackageManager,
        clientDir: '/test/dir'
      })
    }).toThrow('Invalid package manager.')
  })
})
