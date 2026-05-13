import { ENV } from '@/constants/env'
import type { StorageFolder } from '@stardust/core/storage/structures'

export function useFileStorage(storageFolder: StorageFolder, fileName: string) {
  return `${ENV.supabaseCdnUrl}/${storageFolder.value}/${fileName}`
}
