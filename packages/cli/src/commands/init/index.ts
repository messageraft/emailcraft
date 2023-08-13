import { Command, Flags } from '@oclif/core'
import { debug as debugInit } from 'debug'
import { downloadClient } from '../../modules/downloadClient'
import fs from 'fs'
import ora from 'ora'
import { DEFAULT_CLIENT_DIR, DEFAULT_EMAILS_DIR } from '../../constants'
import { closeOraOnSIGNIT } from '../../utils/closeOraOnSigInt'

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
    closeOraOnSIGNIT(spinner)

    try {
      if (!fs.existsSync(emailsDir)) {
        throw new Error(
          `Missing email templates folder - [provided-path]: "${emailsDir}", [default]: "${DEFAULT_EMAILS_DIR}"`
        )
      }

      if (fs.existsSync(clientDir)) {
        spinner.text = 'Client already downloaded'
        spinner.succeed()
        process.exit(0)
      }

      spinner.text = 'Downloading client...'
      await downloadClient({ clientDir })
    } catch (error) {
      spinner.stop()
      console.log(error)
      process.exit(1)
    }

    spinner.text = 'Client downloaded'
    spinner.succeed()

    process.exit(0)
  }
}
