import shell from 'shelljs'
import { installDependencies } from './installDependencies'
import { closeOraOnSIGNIT } from '../utils/closeOraOnSigInt'
import { PackageManager } from '../typings'
import { mockOra } from '../__mocks__/ora.mock'

jest.mock('../utils/closeOraOnSigInt')

describe('installDependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(shell.test as jest.Mock).mockReturnValue(true)
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
