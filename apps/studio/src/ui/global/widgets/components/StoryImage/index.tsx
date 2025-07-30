import type { ComponentProps } from 'react'

import { StorageFolder } from '@stardust/core/storage/structures'

import { useImage } from '@/ui/global/hooks/useImage'
import { StoryImageView } from './StoryImageView'

export const StoryImage = (props: ComponentProps<'img'>) => {
  const image = useImage(StorageFolder.createAsStory(), props.src ?? '')
  return <StoryImageView {...props} src={image} />
}
