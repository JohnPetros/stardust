import Image from 'next/image'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { UserAvatar } from '../../../../../../components/UserAvatar'

import type { User as UserType } from '@/@types/User'
import { PODIUM } from '@/global/constants'

const positionStyles = tv({
  base: 'font-semibold p-2 w-12 grid place-content-center group-hover:text-gray-100/90',
  variants: {
    color: {
      safe: 'text-green-700',
      neutral: 'text-gray-500',
      danger: 'text-red-700',
    },
  },
})

interface RankedUserProps {
  data: UserType
  position: number
  lastPositionsOffset: number
  isAuthUser: boolean
  canShowXp?: boolean
}

export function RankedUser({
  data: { id, name, avatarId, weeklyXp },
  position,
  lastPositionsOffset,
  isAuthUser,
  canShowXp = true,
}: RankedUserProps) {
  const isInPodium = position <= 3
  const isInSafeArea = position <= 5
  const isInDangerArea = position > lastPositionsOffset

  const icon = isInPodium
    ? PODIUM.find((place) => place.position === position)?.icon
    : ''

  const color = isInSafeArea ? 'safe' : isInDangerArea ? 'danger' : 'neutral'

  return (
    <Link
      href={`/profile/${id}`}
      className={twMerge(
        'group flex w-full items-center justify-between rounded-md border-2 p-3 hover:border-gray-100/90',
        isAuthUser ? 'border-green-700' : 'border-gray-800'
      )}
    >
      <div className="mr-2 flex items-center gap-2 text-lg">
        <span className={positionStyles({ color })}>
          {isInPodium ? (
            <Image src={`/icons/${icon}`} width={32} height={32} alt="" />
          ) : (
            position
          )}
        </span>
        <UserAvatar avatarId={avatarId} size={48} />
      </div>

      <strong
        className={twMerge(
          'block truncate text-gray-500 group-hover:text-gray-100/90',
          isAuthUser ? 'text-gray-100' : 'text-gray-500'
        )}
      >
        {name}
      </strong>

      <strong className="block w-24 text-right uppercase text-gray-600 group-hover:text-gray-100/90">
        {canShowXp && weeklyXp + ' xp'}
      </strong>
    </Link>
  )
}
