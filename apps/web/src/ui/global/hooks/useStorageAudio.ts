import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { useFileStorage } from './useFileStorage'

export function useStorageAudio(fileName?: string): { url: string | null } {
  if (!fileName) return { url: null }

  return {
    url: useFileStorage(FileStorageFolderPath.createAsAudiosStory(), fileName),
  }
}
