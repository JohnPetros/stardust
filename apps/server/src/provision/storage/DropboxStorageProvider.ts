import fs from 'node:fs/promises'

import { Dropbox } from 'dropbox'

import { AppError } from '@stardust/core/global/errors'
import { MethodNotImplementedError } from '@stardust/core/global/errors'
import type { StorageFolder } from '@stardust/core/storage/structures'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'

import { ENV } from '@/constants'

export class DropboxStorageProvider implements StorageProvider {
  private dropbox: Dropbox
  private readonly restClient: RestClient
  private static readonly BASE_URL = 'https://api.dropbox.com'

  constructor(restClient: RestClient) {
    this.dropbox = new Dropbox()
    this.restClient = restClient
    this.restClient.setBaseUrl(DropboxStorageProvider.BASE_URL)
  }

  async upload(folder: StorageFolder, file: File): Promise<File> {
    try {
      const accessToken = await this.fetchAccessToken()
      this.dropbox = new Dropbox({ accessToken })

      const fullPath = `/${folder.name}/${ENV.mode === 'development' ? 'dev' : 'prod'}/${file.name}`

      const fileBuffer = await this.fileToBuffer(file)

      const response = await this.dropbox.filesUpload({
        path: fullPath,
        contents: fileBuffer,
        mode: { '.tag': 'overwrite' },
      })

      if (!response || !response.result.id || !response.result.name) {
        this.handleError('Failed to upload file to Dropbox')
      }

      await fs.unlink(file.name)

      return file
    } catch (error) {
      console.log('error', error)
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

  private async fetchAccessToken(): Promise<string> {
    this.restClient.setQueryParam('grant_type', 'refresh_token')
    this.restClient.setQueryParam('refresh_token', ENV.dropboxRefreshToken)
    this.restClient.setQueryParam('client_id', ENV.dropboxAppKey)
    this.restClient.setQueryParam('client_secret', ENV.dropboxAppSecret)
    const response = await this.restClient.post<{ access_token: string }>('/oauth2/token')
    return response.body.access_token
  }

  private handleError(error: unknown): never {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new AppError(errorMessage, 'Dropbox Storage Provider Error')
  }
}
