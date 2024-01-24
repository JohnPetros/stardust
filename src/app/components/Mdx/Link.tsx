import { ReactNode } from 'react'
import NextLink from 'next/link'

type LinkProps = {
  url: string
  href: string
  children: ReactNode
}

export function Link({ children, href, url }: LinkProps) {
  return (
    <NextLink
      href={href ?? url}
      target="_blank"
      className="text-sm font-medium text-green-600"
    >
      {Array.isArray(children) ? children[0] : children}
    </NextLink>
  )
}
