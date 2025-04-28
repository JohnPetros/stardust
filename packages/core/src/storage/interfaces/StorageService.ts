import type { ImagesBucket } from '../types'

export interface StorageService {
  fetchImage(bucket: ImagesBucket, resource: string): string
}
