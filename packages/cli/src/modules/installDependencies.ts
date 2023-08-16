import shell from 'shelljs'
import path from 'path'
import { PackageManager } from '../typings'
import { closeOraOnSIGNIT } from '../utils/closeOraOnSigInt'
import logSymbols from 'log-symbols'
import { spinner } from '../utils/spinner'
import { VALID_PACKAGE_MANAGERS } from '../constants'

interface InstallDependencies {
  packageManager: PackageManager
  clientDir: string
}
export const installDependencies = ({
  packageManager,
  clientDir
}: InstallDependencies) => {
  spinner.start('Installing dependencies...\n')
  closeOraOnSIGNIT(spinner)

  // Check if clientDir exists
  if (!shell.test('-d', clientDir)) {
    spinner.fail('Failed to install dependencies')
    throw new Error('Directory does not exist.')
  }

  // Validate the package manager
  if (!VALID_PACKAGE_MANAGERS.includes(packageManager)) {
    spinner.fail('Failed to install dependencies')
    throw new Error('Invalid package manager.')
  }

  shell.cd(path.join(clientDir))
  shell.exec(`${packageManager} install`)
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed'
  })
}
