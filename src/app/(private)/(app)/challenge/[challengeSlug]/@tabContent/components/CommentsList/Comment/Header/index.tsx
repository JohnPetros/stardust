'use client'

import { DotsThreeOutlineVertical } from '@phosphor-icons/react'
import Link from 'next/link'

import { PopoverMenu, PopoverMenuButton } from '@/global/components/PopoverMenu'
import { useDate } from '@/services/date'
import { ROUTES } from '@/global/constants'
import { deslugify } from '@/global/helpers'

type HeaderProps = {
  userSlug: string
  commentCreatedAt: Date
  popoverMenuButtons: PopoverMenuButton[]
  isAuthUser: boolean
}

export function Header({
  popoverMenuButtons,
  commentCreatedAt,
  userSlug,
  isAuthUser,
}: HeaderProps) {
  const { format } = useDate()

  const userName = deslugify(userSlug)
  const date = format(commentCreatedAt, 'DD/MM/YYYY')

  return (
    <header className="flex items-start justify-between">
      <Link
        href={`${ROUTES.private.home.profile}/${userSlug}`}
        className="text-sm text-green-700"
      >
        {userName}
      </Link>
      <div className="flex items-center">
        <time className="text-sm text-green-700">{date}</time>
        {isAuthUser && (
          <PopoverMenu label="menu do comentário" buttons={popoverMenuButtons}>
            <button className="grid translate-x-2 place-content-center p-2">
              <DotsThreeOutlineVertical
                className=" text-green-700"
                weight="fill"
              />
            </button>
          </PopoverMenu>
        )}
      </div>
    </header>
  )
}
