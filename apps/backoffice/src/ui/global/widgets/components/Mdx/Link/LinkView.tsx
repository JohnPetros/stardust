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

    // Validate URL to prevent javascript: and other malicious schemes
    try {
      // Use a base URL to allow parsing of relative URLs
      const urlObj = new URL(linkDestino, 'https://example.com')
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        linkDestino = 'about:blank'
      } else {
        // Use the full href as provided (absolute or relative)
        linkDestino = urlObj.href
      }
    } catch {
      // If not a valid URL, set to about:blank
      linkDestino = 'about:blank'
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
