import type { StorageFolder } from '../types'

export interface StorageProvider {
  upload(folder: StorageFolder, file: File): Promise<{ fileKey: string }>
}
