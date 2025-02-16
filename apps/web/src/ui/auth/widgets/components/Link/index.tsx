import NextLink from 'next/link'
import type { ReactNode } from 'react'

interface LinkProps {
  children: ReactNode
  href: string
}

export function Link({ children, href }: LinkProps) {
  return (
    <NextLink
      className='p-2 text-sm text-gray-300 transition-colors duration-200 hover:text-gray-100'
      href={href}
    >
      {children}
    </NextLink>
  )
}
