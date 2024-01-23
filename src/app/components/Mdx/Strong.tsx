import { ReactNode } from 'react'

type BoldProps = {
  children: ReactNode
}

export function Strong({ children }: BoldProps) {
  return <span className="strong">{children}</span>
}
