import { installDependencies } from './installDependencies'
import shell from 'shelljs'
import ora from 'ora'
import { closeOraOnSIGNIT } from '../utils/closeOraOnSigInt'
import { PackageManager } from '../typings'

jest.mock('shelljs', () => ({
  cd: jest.fn(),
  exec: jest.fn()
}))
jest.mock('ora', () => {
  const texts: string[] = []

  const mockOra: any = () => ({
    start: jest.fn().mockImplementation(function (this: any) {
      return this
    }),
    set text(text: string) {
      texts.push(text)
    },
    succeed: jest.fn().mockImplementation(function (this: any) {
      return this
    }),
    stopAndPersist: jest.fn().mockImplementation(function (this: any) {
      return this
    })
  })

  return mockOra
})

jest.mock('../utils/closeOraOnSigInt')

describe('installDependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should switch to the clientDir directory', () => {
    installDependencies({ packageManager: 'npm', clientDir: '/test/dir' })
    expect(shell.cd).toHaveBeenCalledWith('/test/dir')
  })

  it('should call the package manager install command', () => {
    installDependencies({ packageManager: 'npm', clientDir: '/test/dir' })
    expect(shell.exec).toHaveBeenCalledWith('npm install')
  })

  it.only('should display spinner messages', () => {
    installDependencies({ packageManager: 'npm', clientDir: '/test/dir' })

    const mockOra = ora as jest.MockedFunction<typeof ora>
    const mockSpinner = mockOra.mock.results[0].value

    expect(mockOra).toHaveBeenCalled()
    expect(mockSpinner.start).toHaveBeenCalledWith(
      'Installing dependencies...\n'
    )
    expect(mockSpinner.stopAndPersist).toHaveBeenCalledWith({
      symbol: expect.anything(),
      text: 'Dependencies installed'
    })
  })

  it('should call closeOraOnSIGNIT', () => {
    installDependencies({ packageManager: 'npm', clientDir: '/test/dir' })

    const mockOra = ora as jest.MockedFunction<typeof ora>
    const mockSpinner = mockOra.mock.results[0].value

    expect(mockOra).toHaveBeenCalled()
    expect(closeOraOnSIGNIT).toHaveBeenCalledWith(mockSpinner)
  })

  it('should throw an error if clientDir does not exist', () => {
    ;(shell.cd as jest.Mock).mockImplementationOnce(() => {
      throw new Error()
    })

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
