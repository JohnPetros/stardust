import type { ReactNode } from 'react'
import { Button } from '@react-email/components'

type LinkProps = {
  children: ReactNode
  className?: string
  href: string
}

export function Link({ children, className, href }: LinkProps) {
  return (
    <Button
      className={`w-full rounded-md bg-green-400 py-3 text-center text-base font-semibold text-gray-900 transition-opacity duration-200 hover:opacity-40 ${className}`}
      href={href}
    >
      {children}
    </Button>
  )
}
