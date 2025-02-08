'use client'

import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types'

type TabButtonProps = {
  contentType: ChallengeContent
  isActive: boolean
  title: string
  isBlocked?: boolean
  blockMessage?: string
}

export function ChallengeContentLink({
  contentType,
  isActive,
  isBlocked = false,
  title,
  ...props
}: TabButtonProps) {
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()

  if (isBlocked) {
    return (
      <button
        {...props}
        type='button'
        className='flex items-center gap-2 rounded-md bg-gray-700 p-2 text-gray-500 text-sm'
      >
        {title}
        <Icon name='lock' size={16} className='text-gray-500' />
      </button>
    )
  }

  return (
    <Link
      href={`${ROUTES.challenging.challenges.challenge(challenge?.slug.value ?? '')}${
        contentType !== 'description' ? `/${contentType}` : ''
      }`}
      className={twMerge(
        'rounded-md bg-gray-700 p-2 text-sm',
        isActive ? 'p-2 text-green-500' : 'text-gray-100',
      )}
    >
      {title}
    </Link>
  )
}
