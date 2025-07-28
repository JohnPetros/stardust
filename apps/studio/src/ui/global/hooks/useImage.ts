import { ENV } from '@/constants'
import type { StorageFolder } from '@stardust/core/storage/types'

export function useImage(storageFolder: StorageFolder, imageName: string) {
  return `${ENV.supabaseCdnUrl}/${storageFolder}/${imageName}`
}
