import type { ReactNode } from 'react'

type Props = {
  url: string
  href: string
  children: ReactNode
}

export const LinkView = ({ children, href, url }: Props) => {
  let linkUrl = href || url || ''

  if (typeof linkUrl === 'string') {
    linkUrl = linkUrl.replace(/['"]/g, '').trim()

    if (linkUrl.length > 0 && !linkUrl.startsWith('http')) {
      linkUrl = `https://${linkUrl}`
    }
  }

  return (
    <a
      href={linkUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='text-sm font-medium text-green-600'
    >
      {Array.isArray(children) ? children[0] : children}
    </a>
  )
}
