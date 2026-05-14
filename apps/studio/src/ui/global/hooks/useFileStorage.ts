import { ENV } from '@/constants/env'
import type { FileStorageFolderPath } from '@stardust/core/storage/structures'

export function useFileStorage(
  FileStorageFolderPath: FileStorageFolderPath,
  fileName: string,
) {
  return `${ENV.supabaseCdnUrl}/${FileStorageFolderPath.value}/${fileName}`
}
