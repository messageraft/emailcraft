import shell from 'shelljs'
import path from 'path'
import {
  CURRENT_PATH,
  DEFAULT_EMAILS_DIR,
  DEFAULT_TEMPLATES_PATH
} from '../constants'
import ora from 'ora'
import { closeOraOnSIGNIT } from '../utils/closeOraOnSigInt'
import logSymbols from 'log-symbols'
export const copyEmailTemplates = () => {
  const spinner = ora('Copying email templates...\n').start()
  closeOraOnSIGNIT(spinner)
  const result = shell.cp(
    '-r',
    path.join(CURRENT_PATH, DEFAULT_TEMPLATES_PATH, '/*'),
    path.join(CURRENT_PATH, DEFAULT_EMAILS_DIR) + '/'
  )
  if (result.stderr) {
    console.error(result.stderr)
  }
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Email templates copied'
  })
}
