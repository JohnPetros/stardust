'use client'

import Link from 'next/link'
import { DotsThreeOutlineVertical } from '@phosphor-icons/react'
import { Datetime } from '@stardust/core/libs'
import type { PopoverMenuButton } from '../../../PopoverMenu/types'
import { ROUTES } from '@/constants'
import { PopoverMenu } from '../../../PopoverMenu'
import { Icon } from '../../../Icon'

type CommentHeaderProps = {
  authorName: string
  authorSlug: string
  commentCreatedAt: Date
  popoverMenuButtons: PopoverMenuButton[]
  isAuthorUser: boolean
}

export function CommentHeader({
  popoverMenuButtons,
  commentCreatedAt,
  authorName,
  authorSlug,
  isAuthorUser,
}: CommentHeaderProps) {
  const date = new Datetime().format(commentCreatedAt, 'DD/MM/YYYY')

  return (
    <header className='flex items-start justify-between'>
      <Link
        href={`${ROUTES.profile.prefix}/${authorSlug}`}
        className='text-md text-green-700'
      >
        {authorName}
      </Link>
      <div className='flex items-center'>
        <time className='text-sm text-green-700'>{date}</time>
        {isAuthorUser && (
          <PopoverMenu label='menu do comentário' buttons={popoverMenuButtons}>
            <button type='button' className='grid translate-x-2 place-content-center p-2'>
              <Icon name='three-dots' size={16} className=' text-green-700' />
            </button>
          </PopoverMenu>
        )}
      </div>
    </header>
  )
}
