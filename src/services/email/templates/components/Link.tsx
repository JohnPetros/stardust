import React, { ReactNode } from 'react'
import { Button } from '@react-email/components'

interface LinkProps {
  children: ReactNode
  href: string
}

export function Link({ children, href }: LinkProps) {
  return <Button href={href}>{children}</Button>
}
