import NextLink from 'next/link'
import { ReactNode } from 'react'

interface LinkProps {
  children: ReactNode
  href: string
}

export function Link({ children, href }: LinkProps) {
  return <NextLink className='text-gray-300 p-2' href={href}>{children}</NextLink>
}
