import { ReactNode } from 'react'
import { Container } from '@react-email/components'

type BoxProps = {
  children: ReactNode
  className?: string
}

export function Box({ children, className }: BoxProps) {
  return (
    <Container className={`space-y-5 rounded-md bg-zinc-800 p-6 ${className}`}>
      {children}
    </Container>
  )
}
