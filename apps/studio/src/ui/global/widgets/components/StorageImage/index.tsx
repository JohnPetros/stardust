import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { StorageImageView } from './StorageImageView'
import { useFileStorage } from '@/ui/global/hooks/useFileStorage'
import type { ComponentProps } from 'react'
import type {
  FileStorageFolderPathName,
  FileStorageFolderPathValue,
} from '@stardust/core/storage/types'

type Props = {
  folder: FileStorageFolderPathValue | FileStorageFolderPathName
  src: string
} & ComponentProps<'img'>

function resolveFolderPath(
  folder: FileStorageFolderPathValue | FileStorageFolderPathName,
) {
  const legacyFolderMap: Record<FileStorageFolderPathName, FileStorageFolderPathValue> = {
    story: 'images/story',
    rockets: 'images/rockets',
    avatars: 'images/avatars',
    planets: 'images/planets',
    achievements: 'images/achievements',
    rankings: 'images/rankings',
    'database-backups': 'database-backups',
    'feedback-reports': 'images/feedback-reports',
    insignias: 'images/insignias',
  }

  return legacyFolderMap[folder as FileStorageFolderPathName] ?? folder
}

export const StorageImage = ({ folder, src, ...props }: Props) => {
  const image = useFileStorage(
    FileStorageFolderPath.create(resolveFolderPath(folder)),
    src,
  )
  return <StorageImageView src={image} {...props} />
}
