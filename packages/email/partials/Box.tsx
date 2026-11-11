import type { ReactNode } from 'react'
import * as React from 'react'
import { Container } from '@react-email/components'

void React

type BoxProps = {
  children: ReactNode
  className?: string
}

export const Box = ({ children, className = '' }: BoxProps) => {
  return (
    <Container className={`rounded-lg bg-gray-900 px-8 pb-4 pt-8 ${className}`}>
      {children}
    </Container>
  )
}
