import { createReadStream, existsSync, unlinkSync } from 'node:fs'
import { type drive_v3, google } from 'googleapis'

import { AppError } from '@stardust/core/global/errors'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import type { StorageFolder } from '@stardust/core/storage/structures'
import type { StorageFolderName } from '@stardust/core/storage/types'
import { MethodNotImplementedError } from '@stardust/core/global/errors'

export class GoogleDriveStorageProvider implements StorageProvider {
  private static readonly KEY_FILE_PATH = './certificates/google-key-file.json'
  private static readonly SCOPES = ['https://www.googleapis.com/auth/drive']
  private static readonly DRIVE_VERSION = 'v3'
  private static readonly PARENT_FOLDER_IDS: Record<StorageFolderName, string> = {
    'database-backups': '1XsXyob4JyuqzfeZ_6AQK3f6lgqiE8HrB',
    story: '',
    avatars: '',
    rockets: '',
    rankings: '',
    planets: '',
    achievements: '',
  }
  private readonly drive: drive_v3.Drive

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: GoogleDriveStorageProvider.KEY_FILE_PATH,
      scopes: GoogleDriveStorageProvider.SCOPES,
    })

    this.drive = google.drive({ version: GoogleDriveStorageProvider.DRIVE_VERSION, auth })
  }

  async upload(folder: StorageFolder, file: File): Promise<File> {
    const parentFolderId = GoogleDriveStorageProvider.PARENT_FOLDER_IDS[folder.name]
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

  async listFiles(): Promise<{ files: File[]; totalFilesCount: number }> {
    throw new MethodNotImplementedError('listFiles')
  }

  async removeFile(): Promise<void> {
    throw new MethodNotImplementedError('removeFile')
  }
}
