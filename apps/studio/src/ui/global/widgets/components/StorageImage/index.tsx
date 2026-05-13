import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { StorageImageView } from './StorageImageView'
import { useFileStorage } from '@/ui/global/hooks/useFileStorage'
import type { ComponentProps } from 'react'
import type { FileStorageFolderPathName } from '@stardust/core/storage/types'

type Props = {
  folder: FileStorageFolderPathName
  src: string
} & ComponentProps<'img'>

export const StorageImage = ({ folder, src, ...props }: Props) => {
  const image = useFileStorage(FileStorageFolderPath.create(folder), src)
  return <StorageImageView src={image} {...props} />
}
