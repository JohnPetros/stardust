import type { ImagesBucket } from '../../../storage/types'

export interface IStorageService {
  fetchImage(bucket: ImagesBucket, resource: string): string
}
