import type { ComponentProps } from 'react'

export function Container({ children, ...divProps }: ComponentProps<'div'>) {
  return (
    <div className='flex items-center gap-2' {...divProps}>
      {children}
    </div>
  )
}
