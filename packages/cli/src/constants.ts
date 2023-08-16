import path from 'path'
import { PackageManager } from './typings'
export const CURRENT_PATH = process.cwd()

export const DEFAULT_EMAILS_DIR = '.emails'
export const DEFAULT_CLIENT_DIR = path.join(CURRENT_PATH, 'emailcraft-client')
export const DEFAULT_TEMPLATES_PATH = '../templates/src'
export const REMOTE_CLIENT_DIR = 'apps/web'

export const VALID_PACKAGE_MANAGERS: PackageManager[] = ['npm', 'yarn', 'pnpm'] // Add others as needed
