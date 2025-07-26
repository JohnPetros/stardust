import { Dropbox } from 'dropbox'

import { AppError } from '@stardust/core/global/errors'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import type { StorageFolder } from '@stardust/core/storage/types'
import { MethodNotImplementedError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'

export class DropboxStorageProvider implements StorageProvider {
  private static readonly DROPBOX_FOLDER_PATHS: Record<StorageFolder, string> = {
    'database-backups': '/database-backups',
    story: '/story',
  }
  private readonly dropbox: Dropbox

  constructor() {
    this.dropbox = new Dropbox({
      accessToken: ENV.dropboxAccessToken,
    })
  }

  async upload(folder: StorageFolder, file: File): Promise<File> {
    try {
      const dropboxPath = DropboxStorageProvider.DROPBOX_FOLDER_PATHS[folder]
      const fullPath = `${dropboxPath}/${file.name}`

      const fileBuffer = await this.fileToBuffer(file)

      const response = await this.dropbox.filesUpload({
        path: fullPath,
        contents: fileBuffer,
        mode: { '.tag': 'overwrite' },
      })

      if (!response.result) {
        this.handleError('Failed to upload file to Dropbox')
      }

      return file
    } catch (error) {
      this.handleError(error)
    }
  }

  async listFiles(): Promise<File[]> {
    throw new MethodNotImplementedError('listFiles')
  }

  async removeFile(): Promise<void> {
    throw new MethodNotImplementedError('removeFile')
  }

  private async fileToBuffer(file: File): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const arrayBuffer = file.arrayBuffer()

      arrayBuffer
        .then((buffer) => {
          resolve(Buffer.from(buffer))
        })
        .catch((error) => {
          reject(new Error(`Failed to read file: ${error.message}`))
        })
    })
  }

  private handleError(error: unknown): never {
    console.error(error)
    throw new AppError('Unknown error', 'Dropbox Storage Provider Error')
  }
}
