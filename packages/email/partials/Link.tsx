import type { ReactNode } from 'react'
import * as React from 'react'
import { Button } from '@react-email/components'

void React

type LinkProps = {
  children: ReactNode
  className?: string
  href: string
}

export const Link = ({ children, className = '', href }: LinkProps) => {
  return (
    <Button
      className={`mb-5 box-border w-full rounded-lg bg-green-400 px-6 py-4 text-center text-base font-semibold text-gray-950 no-underline ${className}`}
      href={href}
    >
      {children}
    </Button>
  )
}
