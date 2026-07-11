import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'

import { AppError } from '@stardust/core/global/errors'
import { Text } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import {
  type FileStorageFolderPath,
  SignedUploadUrl,
} from '@stardust/core/storage/structures'
import type { FilesListingParams } from '@stardust/core/storage/types'

import { ENV } from '@/constants'

export class S3FileStorageProvider implements FileStorageProvider {
  private static readonly BUCKET_NAME_BY_MODE = {
    development: 'stardust-bucket-stg',
    test: 'stardust-bucket-stg',
    production: 'stardust-bucket-prod',
  } as const
  private static readonly CACHE_CONTROL = 'max-age=3600'
  private static readonly SIGNED_UPLOAD_URL_EXPIRES_IN_SECONDS = 3600

  private readonly client: S3Client

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${ENV.s3AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: ENV.s3AccessKeyId,
        secretAccessKey: ENV.s3SecretAccessKey,
      },
    })
  }

  async uploadMany(folder: FileStorageFolderPath, files: File[]): Promise<File[]> {
    return await Promise.all(files.map(async (file) => await this.upload(folder, file)))
  }

  async upload(folder: FileStorageFolderPath, file: File): Promise<File> {
    const fileName = this.resolveFileName(file)
    const key = this.buildKey(folder, Text.create(fileName))
    const contentType = this.resolveContentType(file, fileName)
    const fileToUpload = this.normalizeFile(file, fileName, contentType)

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: Buffer.from(await fileToUpload.arrayBuffer()),
          ContentType: contentType,
          CacheControl: S3FileStorageProvider.CACHE_CONTROL,
        }),
      )
    } catch (error) {
      this.handleError(error, `uploading ${key}`)
    }

    return fileToUpload
  }

  async createSignedUploadUrl(
    folderPath: FileStorageFolderPath,
    fileName: Text,
  ): Promise<SignedUploadUrl> {
    const key = this.buildKey(folderPath, fileName)

    try {
      const url = await getSignedUrl(
        this.client,
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
        {
          expiresIn: S3FileStorageProvider.SIGNED_UPLOAD_URL_EXPIRES_IN_SECONDS,
        },
      )

      return SignedUploadUrl.create({
        url,
        folderPath: folderPath.value,
        fileName: fileName.value,
      })
    } catch (error) {
      this.handleError(error, `creating signed upload url for ${key}`)
    }
  }

  async listFiles({
    folder,
    page,
    itemsPerPage,
    search,
  }: FilesListingParams): Promise<ManyItems<File>> {
    const allObjects = await this.listAllObjects(folder, search)
    const firstItemIndex = (page.value - 1) * itemsPerPage.value
    const pageObjects = allObjects.slice(
      firstItemIndex,
      firstItemIndex + itemsPerPage.value,
    )
    const files: File[] = []

    for (const object of pageObjects) {
      const key = object.Key
      const fileName = key ? this.resolveFileNameFromKey(folder, key) : null

      if (fileName) {
        const file = await this.getFile(folder, Text.create(fileName))
        if (file) files.push(file)
      }
    }

    return { items: files, count: allObjects.length }
  }

  async findFile(folder: FileStorageFolderPath, fileName: Text): Promise<File | null> {
    const key = this.buildKey(folder, fileName)

    try {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: key,
          MaxKeys: 1,
        }),
      )
      const foundFile = response.Contents?.find((object) => object.Key === key)

      if (!foundFile) {
        return null
      }

      return await this.getFile(folder, fileName)
    } catch (error) {
      this.handleError(error, `finding file ${fileName.value} in ${folder.value}`)
    }
  }

  async removeFile(folder: FileStorageFolderPath, fileName: Text): Promise<void> {
    const key = this.buildKey(folder, fileName)

    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      )
    } catch (error) {
      this.handleError(error, `removing file ${fileName.value} from ${folder.value}`)
    }
  }

  private async listAllObjects(folder: FileStorageFolderPath, search: Text) {
    const objects = []
    let continuationToken: string | undefined

    try {
      do {
        const response = await this.client.send(
          new ListObjectsV2Command({
            Bucket: this.bucketName,
            Prefix: `${folder.value}/`,
            ContinuationToken: continuationToken,
          }),
        )

        for (const object of response.Contents ?? []) {
          const key = object.Key
          if (key && this.matchesSearch(folder, key, search)) {
            objects.push(object)
          }
        }

        continuationToken = response.NextContinuationToken
      } while (continuationToken)
    } catch (error) {
      this.handleError(error, `listing files in ${folder.value}`)
    }

    return objects
  }

  private async getFile(
    folder: FileStorageFolderPath,
    fileName: Text,
  ): Promise<File | null> {
    const key = this.buildKey(folder, fileName)

    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      )

      const body = response.Body
      if (!body?.transformToByteArray) {
        return null
      }

      const bytes = await body.transformToByteArray()
      return new File([bytes], fileName.value, {
        type: response.ContentType ?? 'application/octet-stream',
        lastModified: response.LastModified?.getTime() ?? Date.now(),
      })
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null
      }

      this.handleError(error, `reading file ${key}`)
    }
  }

  private matchesSearch(
    folder: FileStorageFolderPath,
    key: string,
    search: Text,
  ): boolean {
    const fileName = this.resolveFileNameFromKey(folder, key)
    if (!fileName) return false

    return fileName.toLowerCase().includes(search.value.toLowerCase())
  }

  private resolveFileNameFromKey(
    folder: FileStorageFolderPath,
    key: string,
  ): string | null {
    const prefix = `${folder.value}/`

    if (!key.startsWith(prefix)) {
      return null
    }

    const fileName = key.slice(prefix.length)
    return fileName.length > 0 && !fileName.includes('/') ? fileName : null
  }

  private buildKey(folder: FileStorageFolderPath, fileName: Text): string {
    return `${folder.value}/${fileName.value}`
  }

  private get bucketName(): string {
    return S3FileStorageProvider.BUCKET_NAME_BY_MODE[ENV.mode]
  }

  private handleError(error: unknown, operation: string): never {
    const message = this.resolveErrorMessage(error)
    const errorMessage = `Error while ${operation}: ${message}`

    console.error('S3 Storage Provider error:', {
      message: errorMessage,
      originalError: error,
    })

    throw new AppError(errorMessage, 'S3 Storage ProviderError')
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message
    }

    if (typeof error === 'string') {
      return error
    }

    return 'Unknown storage error'
  }

  private isNotFoundError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      '$metadata' in error &&
      typeof error.$metadata === 'object' &&
      error.$metadata !== null &&
      'httpStatusCode' in error.$metadata &&
      error.$metadata.httpStatusCode === 404
    )
  }

  private resolveFileName(file: File): string {
    const trimmedName = file.name?.trim()

    if (trimmedName) {
      return trimmedName
    }

    const extension = this.extensionFromType(file.type)
    return `${randomUUID()}.${extension}`
  }

  private resolveContentType(file: File, fileName: string): string {
    const trimmedType = file.type?.trim()

    if (trimmedType) {
      return trimmedType
    }

    const extension = fileName.split('.').pop()?.toLowerCase()
    if (extension === 'wav') return 'audio/wav'
    if (extension === 'mp3') return 'audio/mpeg'
    if (extension === 'ogg') return 'audio/ogg'

    return 'application/octet-stream'
  }

  private normalizeFile(file: File, fileName: string, contentType: string): File {
    if (file.name === fileName && file.type === contentType) {
      return file
    }

    return new File([file], fileName, {
      type: contentType,
      lastModified: Date.now(),
    })
  }

  private extensionFromType(type?: string | null): string {
    const normalizedType = type?.trim().toLowerCase()

    if (!normalizedType) {
      return 'bin'
    }

    if (normalizedType === 'audio/wav') return 'wav'
    if (normalizedType === 'audio/mpeg') return 'mp3'
    if (normalizedType === 'audio/ogg') return 'ogg'

    return 'bin'
  }
}
