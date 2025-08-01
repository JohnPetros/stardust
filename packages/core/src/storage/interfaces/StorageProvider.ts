import type { Text } from '#global/domain/structures/Text'
import type { StorageFolder } from '../structures'
import type { FilesListingParams } from '../types'

export interface StorageProvider {
  upload(folder: StorageFolder, file: File): Promise<File>
  listFiles(
    params: FilesListingParams,
  ): Promise<{ files: File[]; totalFilesCount: number }>
  removeFile(folder: StorageFolder, fileName: Text): Promise<void>
}
