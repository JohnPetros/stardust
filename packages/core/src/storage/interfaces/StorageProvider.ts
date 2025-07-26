import type { Text } from '#global/domain/structures/Text'
import type { FilesListingParams, StorageFolder } from '../types'

export interface StorageProvider {
  upload(folder: StorageFolder, file: File): Promise<File>
  listFiles(params: FilesListingParams): Promise<File[]>
  removeFile(folder: StorageFolder, fileName: Text): Promise<void>
}
