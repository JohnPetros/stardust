'use client'

import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  href: string
  title: string
  isActive: boolean
  isBlocked: boolean
}

export const ChallengeContentLinkView = ({ href, title, isActive, isBlocked }: Props) => {
  if (isBlocked) {
    return (
      <button
        type='button'
        className='flex items-center gap-2 rounded-md bg-gray-700 p-2 text-sm text-gray-500'
      >
        {title}
        <Icon name='lock' size={16} className='text-gray-500' />
      </button>
    )
  }

  return (
    <Link
      href={href}
      className={twMerge(
        'rounded-md bg-gray-700 p-2 text-sm',
        isActive ? 'p-2 text-green-500' : 'text-gray-100',
      )}
    >
      {title}
    </Link>
  )
}
