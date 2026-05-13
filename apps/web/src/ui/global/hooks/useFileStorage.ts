import { CLIENT_ENV } from '@/constants'
import type { FileStorageFolderPath } from '@stardust/core/storage/structures'

export function useFileStorage(folderPath: FileStorageFolderPath, fileName: string) {
  console.log(`${CLIENT_ENV.supabaseCdnUrl}/${folderPath.value}/${fileName}`)
  return `${CLIENT_ENV.supabaseCdnUrl}/${folderPath.value}/${fileName}`
}
