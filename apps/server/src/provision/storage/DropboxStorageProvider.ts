import { Dropbox } from 'dropbox'

import { AppError } from '@stardust/core/global/errors'
import { MethodNotImplementedError } from '@stardust/core/global/errors'
import type { StorageFolder } from '@stardust/core/storage/structures'
import type { StorageProvider } from '@stardust/core/storage/interfaces'

import { ENV } from '@/constants'

export class DropboxStorageProvider implements StorageProvider {
  private readonly dropbox: Dropbox

  constructor() {
    this.dropbox = new Dropbox({
      accessToken: ENV.dropboxAccessToken,
    })
  }

  async upload(folder: StorageFolder, file: File): Promise<File> {
    try {
      const fullPath = `/${folder.name}/${file.name}`

      const fileBuffer = await this.fileToBuffer(file)

      const response = await this.dropbox.filesUpload({
        path: fullPath,
        contents: fileBuffer,
        mode: { '.tag': 'overwrite' },
      })

      if (!response || !response.result.id || !response.result.name) {
        this.handleError('Failed to upload file to Dropbox')
      }

      return file
    } catch (error) {
      this.handleError(error)
    }
  }

  async listFiles(): Promise<{ files: File[]; totalFilesCount: number }> {
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new AppError(errorMessage, 'Dropbox Storage Provider Error')
  }
}
