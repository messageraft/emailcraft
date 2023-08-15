import { Command, Flags } from '@oclif/core'
import { detect as detectPackageManager } from 'detect-package-manager'
import { findRoot } from '@manypkg/find-root'
import { debug as debugInit } from 'debug'
import fs from 'fs'
import ora from 'ora'
import path from 'path'
import { downloadClient } from '../../modules/downloadClient'
import {
  CURRENT_PATH,
  DEFAULT_CLIENT_DIR,
  DEFAULT_EMAILS_DIR
} from '../../constants'
import { closeOraOnSIGNIT } from '../../utils/closeOraOnSigInt'
import { PackageManager } from '../../typings'
import { installDependencies } from '../../modules/installDependencies'
import logSymbols from 'log-symbols'
import { copyEmailTemplates } from '../../modules/copyEmailTemplates'

const debug = debugInit('emailcraft:init')
export default class Init extends Command {
  static description = 'Prepares directory structure for email development'

  static examples = [`$ emailcraft init --emailsDir <path> --clientDir <path>`]

  static flags = {
    emailsDir: Flags.string({
      char: 't',
      description: 'Specify directory of email components',
      required: false,
      default: DEFAULT_EMAILS_DIR
    }),
    clientDir: Flags.string({
      char: 'c',
      description: 'Specify target directory for email development client app',
      required: false,
      default: DEFAULT_CLIENT_DIR
    })
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Init)
    debug('parsing args', args)
    debug('parsing flags', flags)
    const { emailsDir, clientDir } = flags

    const spinner = ora('Checking...').start()
    const cwd = await findRoot(CURRENT_PATH).catch(() => ({
      rootDir: CURRENT_PATH
    }))
    const packageManager: PackageManager = await detectPackageManager({
      cwd: cwd.rootDir
    }).catch(() => 'npm')

    closeOraOnSIGNIT(spinner)

    try {
      if (!fs.existsSync(emailsDir)) {
        debug('creating emails dir')
        fs.mkdirSync(path.join(CURRENT_PATH, emailsDir), { recursive: true })
      }

      if (fs.existsSync(clientDir)) {
        spinner.text = 'Client already downloaded'
        spinner.succeed()
        process.exit(0)
      }

      await downloadClient({ clientDir })
      installDependencies({ packageManager, clientDir })
      copyEmailTemplates()
    } catch (error) {
      spinner.stop()
      console.log(error)
      process.exit(1)
    }

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Finished'
    })

    process.exit(0)
  }
}
