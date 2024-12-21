import type { IStorageService } from '@stardust/core/interfaces'
import type { ImagesBucket } from '@stardust/core/storage/types'

export const SupabaseStorageService = (): IStorageService => {
  return {
    fetchImage(bucket: ImagesBucket, resource: string) {
      return `${process.env.NEXT_PUBLIC_CDN_URL}/${bucket}/${resource}`
    },
  }
}
