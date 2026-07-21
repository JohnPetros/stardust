'use client'

import { type ForwardedRef, forwardRef, type HTMLAttributes } from 'react'

import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types'
import { ChallengeContentLinkView } from './ChallengeContentLinkView'
import { useChallengeContentLink } from './useChallengeContentLink'

type ExternalProps = Omit<HTMLAttributes<HTMLElement>, 'children'>

type Props = {
  contentType: ChallengeContent
  isActive: boolean
  title: string
  isBlocked?: boolean
} & ExternalProps

const Component = (
  { contentType, isActive, title, isBlocked = false, ...rest }: Props,
  ref: ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
) => {
  const { href } = useChallengeContentLink({ contentType })

  return (
    <ChallengeContentLinkView
      ref={ref}
      href={href}
      title={title}
      isActive={isActive}
      isBlocked={isBlocked}
      {...rest}
    />
  )
}

export const ChallengeContentLink = forwardRef(Component)
