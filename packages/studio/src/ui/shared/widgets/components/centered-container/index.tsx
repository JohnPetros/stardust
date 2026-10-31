import type { PropsWithChildren } from 'react'

export type CenteredContainerProps = PropsWithChildren

export const CenteredContainer = ({ children }: CenteredContainerProps) => {
  return (
    <div className='absolute inset-0 flex items-center justify-center text-xxs text-muted-foreground'>
      {children}
    </div>
  )
}
