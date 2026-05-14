import { CLIENT_ENV } from '@/constants'
import type { FileStorageFolderPath } from '@stardust/core/storage/structures'

export function useFileStorage(folderPath: FileStorageFolderPath, fileName: string) {
  return `${CLIENT_ENV.supabaseCdnUrl}/${folderPath.value}/${fileName}`
}
