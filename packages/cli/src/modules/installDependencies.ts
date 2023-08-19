import ora from 'ora'
import shell from 'shelljs'
import path from 'path'
import { PackageManager } from '../typings'
import { closeOraOnSIGNIT } from '../utils/closeOraOnSigInt'
import logSymbols from 'log-symbols'
import { VALID_PACKAGE_MANAGERS } from '../constants'

interface InstallDependencies {
  packageManager: PackageManager
  clientDir: string
}
export const installDependencies = ({
  packageManager,
  clientDir
}: InstallDependencies) => {
  const spinner = ora().start('Installing dependencies...\n')
  closeOraOnSIGNIT(spinner)

  if (!shell.test('-d', clientDir)) {
    spinner.fail('Failed to install dependencies')
    throw new Error('Directory does not exist.')
  }

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
