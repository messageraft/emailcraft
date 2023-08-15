import shell from 'shelljs'
import path from 'path'
import ora from 'ora'
import { PackageManager } from '../typings'
import { closeOraOnSIGNIT } from '../utils/closeOraOnSigInt'
import logSymbols from 'log-symbols'

interface InstallDependencies {
  packageManager: PackageManager
  clientDir: string
}
export const installDependencies = ({
  packageManager,
  clientDir
}: InstallDependencies) => {
  console.log('ora', ora().start())
  const spinner = ora('Installing dependencies...\n').start()
  console.log('spinner', spinner)
  closeOraOnSIGNIT(spinner)
  shell.cd(path.join(clientDir))
  shell.exec(`${packageManager} install`)
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed'
  })
}
