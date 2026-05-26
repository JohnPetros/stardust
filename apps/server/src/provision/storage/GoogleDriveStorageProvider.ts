import { createReadStream, existsSync, unlinkSync } from 'node:fs'
import { type drive_v3, google } from 'googleapis'

import { AppError } from '@stardust/core/global/errors'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import type {
  FileStorageFolderPath,
  SignedUploadUrl,
} from '@stardust/core/storage/structures'
import type {
  FileStorageFolderPathValue,
  FilesListingParams,
} from '@stardust/core/storage/types'
import type { Text } from '@stardust/core/global/structures'
import { MethodNotImplementedError } from '@stardust/core/global/errors'
import type { ManyItems } from '@stardust/core/global/types'

export class GoogleDriveStorageProvider implements FileStorageProvider {
  private static readonly KEY_FILE_PATH = './certificates/google-key-file.json'
  private static readonly SCOPES = ['https://www.googleapis.com/auth/drive']
  private static readonly DRIVE_VERSION = 'v3'
  private static readonly PARENT_FOLDER_IDS: Record<FileStorageFolderPathValue, string> =
    {
      'database-backups': '1XsXyob4JyuqzfeZ_6AQK3f6lgqiE8HrB',
      'audios/story': '',
      'images/story': '',
      'images/avatars': '',
      'images/rockets': '',
      'images/rankings': '',
      'images/planets': '',
      'images/achievements': '',
      'images/insignias': '',
      'images/feedback-reports': '',
    }
  private readonly drive: drive_v3.Drive

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: GoogleDriveStorageProvider.KEY_FILE_PATH,
      scopes: GoogleDriveStorageProvider.SCOPES,
    })

    this.drive = google.drive({ version: GoogleDriveStorageProvider.DRIVE_VERSION, auth })
  }

  async upload(folder: FileStorageFolderPath, file: File): Promise<File> {
    const parentFolderId = GoogleDriveStorageProvider.PARENT_FOLDER_IDS[folder.value]
    const fileMetadata = {
      name: file.name,
      parents: [parentFolderId],
    }
    const media = {
      mimeType: file.type,
      body: createReadStream(file.name),
    }

    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    })

    if (!response.data.id) {
      throw new AppError('Failed to upload file')
    }

    if (existsSync(file.name)) {
      unlinkSync(file.name)
    }

    return file
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

  async findFile(_folder: FileStorageFolderPath, _fileName: Text): Promise<File | null> {
    throw new Error('Method not implemented.')
  }

  async removeFile(): Promise<void> {
    throw new MethodNotImplementedError('removeFile')
  }
}
