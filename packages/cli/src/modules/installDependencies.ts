import shell from 'shelljs'
import path from 'path'
import { PackageManager } from '../typings'
import { closeOraOnSIGNIT } from '../utils/closeOraOnSigInt'
import logSymbols from 'log-symbols'
import { spinner } from '../utils/spinner'

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
  shell.cd(path.join(clientDir))
  shell.exec(`${packageManager} install`)
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed'
  })
}
