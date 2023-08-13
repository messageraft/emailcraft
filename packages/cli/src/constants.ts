import path from 'path'
export const CURRENT_PATH = process.cwd()

export const DEFAULT_EMAILS_DIR = '../templates/src'
export const DEFAULT_CLIENT_DIR = path.join(CURRENT_PATH, '.emailcraft-client')
export const REMOTE_CLIENT_DIR = 'apps/web'
