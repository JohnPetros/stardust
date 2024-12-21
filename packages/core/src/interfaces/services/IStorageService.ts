import type { ImagesBucket } from '@/@core/types'

export interface IStorageService {
  fetchImage(bucket: ImagesBucket, resource: string): string
}
