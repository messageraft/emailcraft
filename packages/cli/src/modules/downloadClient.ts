import { Octokit } from '@octokit/rest'
import fse from 'fs-extra'
import fs from 'fs'
import shell from 'shelljs'
import path from 'path'
import { REMOTE_CLIENT_DIR } from '../constants'

const DEFAULT_PATH = '.emailcraft'

export const downloadClient = async ({ clientDir }: { clientDir?: string }) => {
  const folderName = clientDir ?? DEFAULT_PATH
  const tempFolderName = folderName + '-temp'
  const octokit = new Octokit()

  let downloadRes
  try {
    downloadRes = await octokit.repos.downloadTarballArchive({
      owner: 'messageraft',
      repo: 'emailcraft'
      // todo add ref versioning - currently uses main branch
    })
  } catch (e) {
    console.log(e)
  }
  fs.mkdirSync(tempFolderName)
  const TAR_PATH = path.join(tempFolderName, 'emailcraft.tar.gz')
  fs.writeFileSync(TAR_PATH, Buffer.from(downloadRes.data as any))
  shell.exec(
    `tar -xzvf ${tempFolderName}/emailcraft.tar.gz -C ${tempFolderName} --strip-components 1`,
    { silent: true }
  )

  fse.moveSync(
    path.join(tempFolderName, REMOTE_CLIENT_DIR),
    path.join(folderName)
  )

  fse.removeSync(tempFolderName)
}
