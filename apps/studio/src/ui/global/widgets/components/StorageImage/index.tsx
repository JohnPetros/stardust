import { StorageFolder } from '@stardust/core/storage/structures'

import { StorageImageView } from './StorageImageView'
import { useStorageImage } from '@/ui/global/hooks/useStorageImage'
import type { ComponentProps } from 'react'
import type { StorageFolderName } from '@stardust/core/storage/types'

type Props = {
  folder: StorageFolderName
  src: string
} & ComponentProps<'img'>

export const StorageImage = ({ folder, src, ...props }: Props) => {
  const image = useStorageImage(StorageFolder.create(folder), src)
  return <StorageImageView src={image} {...props} />
}
