import type { ReactNode } from 'react'

type Props = {
  url: string
  href: string
  children: ReactNode
}

export const LinkView = ({ children, href, url }: Props) => {
  let linkDestino = href || url || ''

  if (typeof linkDestino === 'string') {
    linkDestino = linkDestino.replace(/['"]/g, '').trim()

    if (linkDestino.length > 0 && !linkDestino.startsWith('http')) {
      linkDestino = `https://${linkDestino}`
    }
  }

  return (
    <a
      href={linkDestino}
      target='_blank'
      rel='noopener noreferrer'
      className='text-sm font-medium text-green-600'
    >
      {Array.isArray(children) ? children[0] : children}
    </a>
  )
}
