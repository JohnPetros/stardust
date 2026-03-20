'use client'

import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types'
import { ChallengeContentLinkView } from './ChallengeContentLinkView'
import { useChallengeContentLink } from './useChallengeContentLink'

type Props = {
  contentType: ChallengeContent
  isActive: boolean
  title: string
  isBlocked?: boolean
}

export const ChallengeContentLink = ({
  contentType,
  isActive,
  title,
  isBlocked = false,
}: Props) => {
  const { href } = useChallengeContentLink({ contentType })

  return (
    <ChallengeContentLinkView
      href={href}
      title={title}
      isActive={isActive}
      isBlocked={isBlocked}
    />
  )
}
