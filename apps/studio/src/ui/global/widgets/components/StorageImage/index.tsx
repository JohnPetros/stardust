import type { ComponentProps } from 'react'

import { StorageFolder } from '@stardust/core/storage/structures'

import { StorageImageView } from './StorageImageView'
import { useStorageImage } from '@/ui/global/hooks/useStorageImage'

export const StorageImage = (props: ComponentProps<'img'>) => {
  const image = useStorageImage(StorageFolder.createAsStory(), props.src ?? '')
  return <StorageImageView {...props} src={image} />
}
