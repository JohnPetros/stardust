import type { ReactNode } from 'react'
import * as React from 'react'
import { Button } from '@react-email/components'

void React

type LinkProps = {
  children: ReactNode
  className?: string
  href: string
}

export const Link = ({ children, className, href }: LinkProps) => {
  return (
    <Button
      className={`w-full rounded-md bg-green-400 py-3 text-center text-base font-semibold text-gray-900 ${className}`}
      href={href}
    >
      {children}
    </Button>
  )
}
