import { Command, Flags } from '@oclif/core'
import ora from 'ora'
import normalize from 'normalize-path'
import { glob } from 'glob'
import path from 'path'
import { debug as debugInit } from 'debug'
import esbuild from 'esbuild'
import fs from 'fs'
import { render } from '@emailcraft/render'
import { copy, copySync, outputFileSync, removeSync } from 'fs-extra'
import tree from 'tree-node-cli'
import logSymbols from 'log-symbols'
import { closeOraOnSIGNIT } from '../../utils/closeOraOnSigInt'

const debug = debugInit('emailcraft:export')

export default class Export extends Command {
  static description =
    'Renders the templates and exports to the `templates` directory'

  static examples = [
    `$ emailcraft export --outDir <path>`,
    `$ emailcraft export --outDir templates --sourceDir .emails`
  ]

  static flags = {
    sourceDir: Flags.string({
      char: 's',
      description: 'Specify source directory',
      required: false,
      default: '../templates/src'
    }),
    outDir: Flags.string({
      char: 'o',
      description: 'Specify target directory',
      required: false,
      default: 'templates'
    }),
    plainText: Flags.boolean({
      char: 't',
      description: 'Convert to plain text',
      required: false,
      default: false
    }),
    pretty: Flags.boolean({
      char: 't',
      description: 'Prettify exported templates',
      required: false,
      default: false
    })
  }

  // TODO ability to render both html/text using on command
  // TODO ability to keep structure? e.g if templates/auth transfer to templates/auth

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Export)
    debug('parsing args', args)
    debug('parsing flags', flags)
    const { outDir, sourceDir, plainText, pretty } = flags

    const spinner = ora('Preparing files...').start()
    closeOraOnSIGNIT(spinner)

    const templates = glob.sync(
      normalize(path.join(process.cwd(), sourceDir, '**/*.{tsx,jsx}'))
    )
    debug('[templates found]', templates)

    esbuild.buildSync({
      bundle: true,
      entryPoints: templates,
      platform: 'node',
      write: true,
      outdir: outDir
    })
    spinner.succeed()

    const builtTemplates = glob.sync(
      normalize(path.join(process.cwd(), `${outDir}/*.js`)),
      {
        absolute: true
      }
    )
    debug('[built templates]', builtTemplates)

    for (const template of builtTemplates) {
      spinner.text = `rendering ${template.split('/').pop()}`
      spinner.render()
      const component = await import(template)
      const rendered = render(component.default({}), { plainText, pretty })
      const htmlPath = template.replace('.js', plainText ? '.txt' : '.html')
      outputFileSync(htmlPath, rendered)
      removeSync(template)
    }
    spinner.succeed('Rendered all files')

    const staticDir = path.join(process.cwd(), sourceDir, 'static')
    const hasStaticDirectory = fs.existsSync(staticDir)

    if (hasStaticDirectory) {
      debug('[staticDir]', staticDir)
      debug('[outStaticDir]', path.join(process.cwd(), outDir, 'static'))
      spinner.text = `Copying static files`
      spinner.render()
      debug('[Copying Static Files]')

      try {
        copySync(staticDir, path.join(process.cwd(), outDir, 'static'))
      } catch (err) {
        throw new Error(
          `Something went wrong while copying the file to ${outDir}/static, ${err}`
        )
      }
    }

    spinner.succeed()

    const fileTree = tree(outDir, {
      allFiles: true,
      maxDepth: 4
    })

    console.log(fileTree)

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Successfully exported emails'
    })

    process.exit()
  }
}
