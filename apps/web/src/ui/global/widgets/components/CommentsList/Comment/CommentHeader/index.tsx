'use client'

import Link from 'next/link'

import { Datetime } from '@stardust/core/libs'

import { ROUTES } from '@/constants'
import type { PopoverMenuButton } from '../../../PopoverMenu/types'
import { PopoverMenu } from '../../../PopoverMenu'
import { Icon } from '../../../Icon'

type CommentHeaderProps = {
  authorName: string
  authorSlug: string
  commentPostedAt: Date
  popoverMenuButtons: PopoverMenuButton[]
  isAuthorUser: boolean
}

export function CommentHeader({
  popoverMenuButtons,
  commentPostedAt,
  authorName,
  authorSlug,
  isAuthorUser,
}: CommentHeaderProps) {
  const date = new Datetime(commentPostedAt).format('DD/MM/YYYY')

  return (
    <header className='flex items-start justify-between'>
      <Link href={ROUTES.profile.user(authorSlug)} className='text-md text-green-700'>
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
