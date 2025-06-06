import type { ComponentProps } from 'react'

export const Container = ({ children, ...divProps }: ComponentProps<'div'>) => {
  return (
    <div className='flex items-center gap-2' {...divProps}>
      {children}
    </div>
  )
}
