import type { ComponentProps } from 'react'
import { StoryImageView } from './StoryImageView'
import { useImage } from '@/ui/global/hooks/useImage'

export const StoryImage = (props: ComponentProps<'img'>) => {
  const image = useImage('story', props.src ?? '')
  return <StoryImageView {...props} src={image} />
}
