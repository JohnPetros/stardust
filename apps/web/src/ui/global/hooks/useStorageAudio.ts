import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { useFileStorage } from './useFileStorage'

export function useStorageAudio(fileName?: string): { url: string | null } {
  const resolvedFileName = fileName ?? ''
  const url = useFileStorage(
    FileStorageFolderPath.createAsAudiosStory(),
    resolvedFileName,
  )

  return {
    url: fileName ? url : null,
  }
}
