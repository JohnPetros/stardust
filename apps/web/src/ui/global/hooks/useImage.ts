import { CLIENT_ENV } from '@/constants'
import type { StorageFolder } from '@stardust/core/storage/types'

export function useImage(storageFolder: StorageFolder, imageName: string) {
  return `${CLIENT_ENV.supabaseCdnUrl}/${storageFolder}/${imageName}`
}
