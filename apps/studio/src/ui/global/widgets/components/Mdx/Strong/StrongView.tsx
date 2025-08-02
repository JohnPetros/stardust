import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const StrongView = ({ children }: Props) => {
  return <strong className='strong'>{children}</strong>
}
