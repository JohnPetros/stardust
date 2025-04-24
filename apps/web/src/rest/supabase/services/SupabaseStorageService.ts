import { ENV } from '@/constants'
import type { IStorageService } from '@stardust/core/global/interfaces'
import type { ImagesBucket } from '@stardust/core/storage/types'

export const SupabaseStorageService = (): IStorageService => {
  return {
    fetchImage(bucket: ImagesBucket, resource: string) {
      return `${ENV.supabaseCdnUrl}/${bucket}/${resource}`
    },
  }
}
