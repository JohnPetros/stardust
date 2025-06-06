import type { RestClient } from '@stardust/core/global/interfaces'
import type { StorageService as IStorageService } from '@stardust/core/storage/interfaces'
import type { ImagesBucket } from '@stardust/core/storage/types'

export const StorageService = (restClient: RestClient): IStorageService => {
  return {
    fetchImage(bucket: ImagesBucket, resource: string) {
      return 'https://via.placeholder.com/150'
    },
  }
}
