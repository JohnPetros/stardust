import type { Text } from '#global/domain/structures/Text'
import type { ManyItems } from '../../global/domain/types'
import type { FileStorageFolderPath, SignedUploadUrl } from '../domain/structures'
import type { FilesListingParams } from '../types'

export interface FileStorageProvider {
  upload(folder: FileStorageFolderPath, file: File): Promise<File>
  createSignedUploadUrl(
    folderPath: FileStorageFolderPath,
    fileName: Text,
  ): Promise<SignedUploadUrl>
  findFile(folder: FileStorageFolderPath, fileName: Text): Promise<File | null>
  listFiles(params: FilesListingParams): Promise<ManyItems<File>>
  removeFile(folder: FileStorageFolderPath, fileName: Text): Promise<void>
}
