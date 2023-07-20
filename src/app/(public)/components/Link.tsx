import NextLink from 'next/link'
import { ReactNode } from 'react'

interface LinkProps {
  children: ReactNode
  href: string
}

export function Link({ children, href }: LinkProps) {
  return (
    <NextLink
      className="text-gray-300 text-sm p-2 hover:text-gray-100 transition-colors duration-200"
      href={href}
    >
      {children}
    </NextLink>
  )
}
