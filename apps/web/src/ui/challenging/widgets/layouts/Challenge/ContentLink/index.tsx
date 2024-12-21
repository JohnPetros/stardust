'use client'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { ROUTES } from '@/ui/global/constants'
import { Lock } from '@phosphor-icons/react'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import type { ContentType } from '../ContentType'

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

  const className = isActive
    ? 'p-2 text-green-500'
    : isBlocked
      ? 'pointer-events-none flex items-center gap-2 text-gray-500 opacity-50'
      : 'text-gray-100'

  return (
    <Link
      href={`${ROUTES.private.app.challenge}/${challenge?.slug}${
        contentType !== 'description' ? `/${contentType}` : ''
      }`}
      className={twMerge('rounded-md bg-gray-700 p-2 text-sm', className)}
    >
      {isBlocked ? (
        <span className='flex items-center gap-2'>
          {title}
          <Lock className='text-gray-500' />
        </span>
      ) : (
        title
      )}
    </Link>
  )
}
