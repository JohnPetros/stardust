import { CLIENT_ENV } from '@/constants'

type StorageFolder =
  | 'database-backups'
  | 'story'
  | 'avatars'
  | 'rockets'
  | 'rankings'
  | 'planets'
  | 'achievements'

export function useImage(storageFolder: StorageFolder, imageName: string) {
  return `${CLIENT_ENV.supabaseCdnUrl}/${storageFolder}/${imageName}`
}
