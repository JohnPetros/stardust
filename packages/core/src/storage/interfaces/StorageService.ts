import type { ImagesBucket } from '#storage/types'

export interface StorageService {
  fetchImage(bucket: ImagesBucket, resource: string): string
}
