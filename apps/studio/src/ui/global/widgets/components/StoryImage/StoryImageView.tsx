import type { ComponentProps } from 'react'
import { cn } from '@/ui/shadcn/utils'

export const StoryImageView = (props: ComponentProps<'img'>) => {
  return <img {...props} className={cn('rounded-md', props.className)} alt={props.alt} />
}
