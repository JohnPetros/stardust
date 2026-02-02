import { ENV } from '@/constants/env'
import type { StorageFolder } from '@stardust/core/storage/structures'

export function useStorageImage(storageFolder: StorageFolder, imageName: string) {
  return `${ENV.supabaseCdnUrl}/${storageFolder.name}/${imageName}`
}
