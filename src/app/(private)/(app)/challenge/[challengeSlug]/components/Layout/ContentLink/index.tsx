'use client'

import { Lock } from '@phosphor-icons/react'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import type { ContentType } from '@/@types/ContentType'
import { useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/utils/constants'

type TabButtonProps = {
  contentType: ContentType
  isActive: boolean
  title: string
  isBlocked?: boolean
  blockMessage?: string
}

export function ContentLink({
  contentType,
  isActive,
  isBlocked = false,
  title,
}: TabButtonProps) {
  const challengeSlug = useChallengeStore(
    (store) => store.state.challenge?.slug
  )

  return (
    <Link
      href={`${ROUTES.private.challenge}/${challengeSlug}${
        contentType !== 'description' ? `/${contentType}` : ''
      }`}
      className={twMerge(
        'rounded-md bg-gray-700 p-2 text-sm',
        isActive
          ? 'p-2 text-green-500'
          : isBlocked
          ? 'pointer-events-none flex items-center gap-2 text-gray-500 opacity-50'
          : 'text-gray-100'
      )}
    >
      {isBlocked ? (
        <span className="flex items-center gap-2">
          {title}
          <Lock className="text-gray-500" />
        </span>
      ) : (
        title
      )}
    </Link>
  )
}
