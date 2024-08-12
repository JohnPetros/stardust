import type { IStorageService } from '@/@core/interfaces/services'
import type { ImagesBucket } from '@/@core/types'

export const SupabaseStorageService = (): IStorageService => {
  return {
    fetchImage(bucket: ImagesBucket, resource: string) {
      return `${process.env.NEXT_PUBLIC_CDN_URL}/${bucket}/${resource}`
    },
  }
}
