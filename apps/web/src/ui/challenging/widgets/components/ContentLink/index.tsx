'use client'

import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import type { ContentType } from '../../layouts/Challenge/types'

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
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()

  return (
    <Link
      href={`${ROUTES.challenging.challenges.challenge(challenge?.slug.value ?? '')}${
        contentType !== 'description' ? `/${contentType}` : ''
      }`}
      className={twMerge(
        'rounded-md bg-gray-700 p-2 text-sm',
        isActive
          ? 'p-2 text-green-500'
          : isBlocked
            ? 'pointer-events-none flex items-center gap-2 text-gray-500 opacity-50'
            : 'text-gray-100',
      )}
    >
      {isBlocked ? (
        <span className='flex items-center gap-2'>
          {title}
          <Icon name='lock' size={16} className='text-gray-500' />
        </span>
      ) : (
        title
      )}
    </Link>
  )
}
