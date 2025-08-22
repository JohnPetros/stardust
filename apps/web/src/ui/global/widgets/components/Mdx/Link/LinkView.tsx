import type { ReactNode } from 'react'

type LinkProps = {
  url: string
  href: string
  children: ReactNode
}

export const LinkView = ({ children, href, url }: LinkProps) => {
  return (
    <a
      href={href ?? url}
      target='_blank'
      rel='noopener noreferrer'
      className='text-sm font-medium text-green-600'
    >
      {Array.isArray(children) ? children[0] : children}
    </a>
  )
}
