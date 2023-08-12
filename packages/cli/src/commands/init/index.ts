import { Command, Flags } from '@oclif/core'
import { debug as debugInit } from 'debug'
import { downloadClient } from '../../modules/init/downloadClient'

const debug = debugInit('emailcraft:init')

export default class Init extends Command {
  static description = 'Prepares directory structure for email development'

  static examples = [`$ emailcraft init --emails .emails --clientDir <path>`]

  static flags = {
    emails: Flags.string({
      char: 't',
      description: 'Specify directory of email components',
      required: false,
      default: '../templates/src'
    }),
    clientDir: Flags.string({
      char: 'c',
      description: 'Specify target directory for email development client app',
      required: false,
      default: '.emailcraft-client'
    })
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Init)
    debug('parsing args', args)
    debug('parsing flags', flags)
    const { clientDir } = flags

    // const spinner = ora('Preparing files...').start()
    // closeOraOnSIGNIT(spinner)
    await downloadClient({ clientDir })

    process.exit()
  }
}
