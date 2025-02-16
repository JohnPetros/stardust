import type { ReactNode } from 'react'

type BoldProps = {
  children: ReactNode
}

export function Strong({ children }: BoldProps) {
  return <strong className='strong'>{children}</strong>
}
