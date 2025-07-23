import type { StorageService as IStorageService } from '@stardust/core/storage/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { ImagesBucket } from '@stardust/core/storage/types'

import { ENV } from '@/constants'

export const StorageService = (_: RestClient): IStorageService => {
  return {
    fetchImage(bucket: ImagesBucket, resource: string) {
      return `${ENV.supabaseCdnUrl}/${bucket}/${resource}`
    },
  }
}
