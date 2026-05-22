import { ENV } from '@/constants/env'
import type { FileStorageFolderPath } from '@stardust/core/storage/structures'

export function useFileStorage(folderPath: FileStorageFolderPath, fileName: string) {
  return `${ENV.supabaseCdnUrl}/${folderPath.value}/${fileName}`
}
