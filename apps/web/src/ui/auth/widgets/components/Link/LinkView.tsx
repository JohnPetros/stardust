import NextLink from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  testId?: string
  children: ReactNode
  href: string
}

export const LinkView = ({ children, href, testId }: Props) => {
  return (
    <NextLink
      className='p-2 text-sm text-gray-300 transition-colors duration-200 hover:text-gray-100'
      href={href}
      data-testid={testId}
    >
      {children}
    </NextLink>
  )
}
