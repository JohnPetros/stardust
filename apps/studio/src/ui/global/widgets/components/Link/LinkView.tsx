import { cn } from '@/ui/shadcn/utils'
import type { ComponentProps } from 'react'
import { NavLink } from 'react-router'

export const LinkView = (props: ComponentProps<'a'>) => {
  return (
    <NavLink
      to={props.href ?? ''}
      className={cn('hover:opacity-70 transition-opacity', props.className)}
      {...props}
    />
  )
}
