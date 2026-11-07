import NextLink from 'next/link'
import type { ReactNode } from 'react'

type LinkTone = 'highlight' | 'subtle'

type Props = {
  testId?: string
  children: ReactNode
  href: string
  tone?: LinkTone
}

const TONE_CLASS_NAMES: Record<LinkTone, string> = {
  highlight: 'font-medium text-theme-accent-text hover:text-theme-text-primary',
  subtle: 'font-normal text-theme-text-secondary hover:text-theme-text-primary',
}

export const LinkView = ({ children, href, testId, tone = 'subtle' }: Props) => {
  return (
    <NextLink
      className={`inline-flex h-theme-control items-center rounded-theme px-2 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-action ${TONE_CLASS_NAMES[tone]}`}
      href={href}
      data-testid={testId}
    >
      {children}
    </NextLink>
  )
}
