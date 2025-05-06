import { CLIENT_ENV } from '@/constants'
import type { StorageService } from '@stardust/core/storage/interfaces'
import type { ImagesBucket } from '@stardust/core/storage/types'

export const SupabaseStorageService = (): StorageService => {
  return {
    fetchImage(bucket: ImagesBucket, resource: string) {
      return `${CLIENT_ENV.supabaseCdnUrl}/${bucket}/${resource}`
    },
  }
}
