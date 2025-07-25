import type { FilesListingParams, StorageFolder } from '../types'

export interface StorageProvider {
  upload(folder: StorageFolder, file: File): Promise<{ fileKey: string }>
  listFiles(params: FilesListingParams): Promise<File[]>
}
