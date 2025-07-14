import { CLIENT_ENV } from '@/constants'
import type { StorageService as IStorageService } from '@stardust/core/storage/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { ImagesBucket } from '@stardust/core/storage/types'

export const StorageService = (_: RestClient): IStorageService => {
  return {
    fetchImage(bucket: ImagesBucket, resource: string) {
      return `${CLIENT_ENV.supabaseCdnUrl}/${bucket}/${resource}`
    },
  }
}
