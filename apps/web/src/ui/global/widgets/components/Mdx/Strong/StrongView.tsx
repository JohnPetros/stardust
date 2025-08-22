import type { ReactNode } from 'react'

type StrongProps = {
  children: ReactNode
}

export const StrongView = ({ children }: StrongProps) => {
  return <strong className='strong'>{children}</strong>
}
