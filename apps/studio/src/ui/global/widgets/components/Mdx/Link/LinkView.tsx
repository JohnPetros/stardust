import type { ReactNode } from 'react'

type Props = {
  url: string
  href: string
  children: ReactNode
}

export const LinkView = ({ children, href, url }: Props) => {
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
