import { Dropbox } from 'dropbox'

import { AppError, MethodNotImplementedError } from '@stardust/core/global/errors'
import type {
  FileStorageFolderPath,
  SignedUploadUrl,
} from '@stardust/core/storage/structures'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { ManyItems } from '@stardust/core/global/types'
import type { FilesListingParams } from '@stardust/core/storage/types'
import type { Text } from '@stardust/core/global/structures'

import { ENV } from '@/constants'

export class DropboxStorageProvider implements FileStorageProvider {
  private dropbox: Dropbox
  private readonly restClient: RestClient
  private static readonly BASE_URL = 'https://api.dropbox.com'
  private static readonly MAX_UPLOAD_ATTEMPTS = 3
  private static readonly DEFAULT_RETRY_AFTER_IN_SECONDS = 1
  private static readonly INTERNAL_FOLDER_NAME =
    ENV.mode === 'development' ? 'dev' : 'prod'

  constructor(restClient: RestClient) {
    this.dropbox = new Dropbox()
    this.restClient = restClient
    this.restClient.setBaseUrl(DropboxStorageProvider.BASE_URL)
  }

  async uploadMany(folder: FileStorageFolderPath, files: File[]): Promise<File[]> {
    const uploadedFiles: File[] = []
    const backupDate = this.getCurrentDateFolderName()

    for (const file of files) {
      const fullPath = this.buildFileStorageBackupPath(folder, file, backupDate)
      uploadedFiles.push(await this.uploadFile(fullPath, file))
    }

    return uploadedFiles
  }

  async upload(folder: FileStorageFolderPath, file: File): Promise<File> {
    const fullPath = this.buildStoragePath(folder, file.name)

    return await this.uploadFile(fullPath, file)
  }

  async getFileMetadata(
    folderPath: FileStorageFolderPath,
    fileName: Text,
  ): Promise<{ mimeType: string; size: number } | null> {
    const path = this.buildStoragePath(folderPath, fileName.value)

    try {
      const accessToken = await this.fetchAccessToken()
      this.dropbox = new Dropbox({ accessToken })

      const response = await this.dropbox.filesGetMetadata({ path })

      if (response.result['.tag'] !== 'file') {
        return null
      }

      return {
        mimeType: 'application/octet-stream',
        size: response.result.size,
      }
    } catch (error) {
      if (this.isFileNotFoundError(error)) {
        return null
      }

      this.handleError(error)
    }
  }

  private async uploadFile(fullPath: string, file: File): Promise<File> {
    try {
      const accessToken = await this.fetchAccessToken()
      this.dropbox = new Dropbox({ accessToken })

      const fileBuffer = await this.fileToBuffer(file)

      await this.uploadWithRetry(fullPath, fileBuffer)

      return file
    } catch (error) {
      this.handleError(error)
    }
  }

  private buildStoragePath(folder: FileStorageFolderPath, fileName: string): string {
    return `/${DropboxStorageProvider.INTERNAL_FOLDER_NAME}/${folder.value}/${fileName}`
  }

  private buildFileStorageBackupPath(
    folder: FileStorageFolderPath,
    file: File,
    backupDate: string,
  ): string {
    return `/${DropboxStorageProvider.INTERNAL_FOLDER_NAME}/file-storage-backups/${backupDate}/${folder.value}/${file.name}`
  }

  private getCurrentDateFolderName(): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    const dateParts = formatter.formatToParts(new Date())
    const year = dateParts.find((part) => part.type === 'year')?.value
    const month = dateParts.find((part) => part.type === 'month')?.value
    const day = dateParts.find((part) => part.type === 'day')?.value

    return `${year}-${month}-${day}`
  }

  async createSignedUploadUrl(
    _folderPath: FileStorageFolderPath,
    _fileName: Text,
  ): Promise<SignedUploadUrl> {
    throw new MethodNotImplementedError('createSignedUploadUrl')
  }

  async listFiles(_params: FilesListingParams): Promise<ManyItems<File>> {
    throw new MethodNotImplementedError('listFiles')
  }

  async findFile(): Promise<File | null> {
    throw new MethodNotImplementedError('findFile')
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

  private async uploadWithRetry(
    path: string,
    contents: Buffer,
    attempt = 1,
  ): Promise<void> {
    try {
      const response = await this.dropbox.filesUpload({
        path,
        contents,
        mode: { '.tag': 'overwrite' },
      })

      if (!response || !response.result.id || !response.result.name) {
        this.handleError('Failed to upload file to Dropbox')
      }
    } catch (error) {
      if (
        this.isRateLimitError(error) &&
        attempt < DropboxStorageProvider.MAX_UPLOAD_ATTEMPTS
      ) {
        await this.sleep(this.getRetryAfterInMilliseconds(error))
        return await this.uploadWithRetry(path, contents, attempt + 1)
      }

      throw error
    }
  }

  private isRateLimitError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      error.status === 429
    )
  }

  private isFileNotFoundError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null || !('error' in error)) {
      return (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        error.status === 404
      )
    }

    const responseError = error.error

    if (
      typeof responseError !== 'object' ||
      responseError === null ||
      !('error' in responseError)
    ) {
      return false
    }

    const pathError = responseError.error

    return (
      typeof pathError === 'object' &&
      pathError !== null &&
      '.tag' in responseError &&
      responseError['.tag'] === 'path' &&
      '.tag' in pathError &&
      pathError['.tag'] === 'not_found'
    )
  }

  private getRetryAfterInMilliseconds(error: unknown): number {
    const fallbackInSeconds = DropboxStorageProvider.DEFAULT_RETRY_AFTER_IN_SECONDS
    let retryAfterInSeconds = fallbackInSeconds

    if (this.hasDropboxRetryAfter(error)) {
      retryAfterInSeconds = error.error.error.retry_after
    } else if (this.hasRetryAfterHeader(error)) {
      const retryAfterHeader = error.headers.get('retry-after')
      retryAfterInSeconds =
        retryAfterHeader === null ? fallbackInSeconds : Number(retryAfterHeader)
    }

    return Number.isFinite(retryAfterInSeconds)
      ? retryAfterInSeconds * 1000
      : fallbackInSeconds * 1000
  }

  private hasDropboxRetryAfter(
    error: unknown,
  ): error is { error: { error: { retry_after: number } } } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof error.error === 'object' &&
      error.error !== null &&
      'error' in error.error &&
      typeof error.error.error === 'object' &&
      error.error.error !== null &&
      'retry_after' in error.error.error &&
      typeof error.error.error.retry_after === 'number'
    )
  }

  private hasRetryAfterHeader(
    error: unknown,
  ): error is { headers: { get: (name: string) => string | null } } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'headers' in error &&
      typeof error.headers === 'object' &&
      error.headers !== null &&
      'get' in error.headers &&
      typeof error.headers.get === 'function'
    )
  }

  private async sleep(milliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, milliseconds))
  }

  private handleError(error: unknown): never {
    console.error(error)
    throw new AppError(
      'Ocorreu um erro ao acessar o armazenamento de arquivos',
      'Erro do armazenamento de arquivos',
    )
  }
}
