import Image from 'next/image'

import type { User as UserType } from '@/types/user'

import { PODIUM } from '@/utils/constants'
import { UserAvatar } from '../../../components/UserAvatar'
import { tv } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'

const positionStyles = tv({
  base: 'font-semibold p-2 w-12 grid place-content-center',
  variants: {
    color: {
      safe: 'text-green-700',
      neutral: 'text-gray-500',
      danger: 'text-red-700',
    },
  },
})

interface UserProps {
  data: UserType
  position: number
  lastPositionsOffset: number
  isAuthUser: boolean
}

export function RankedUser({
  data: { id, name, avatar_id, weekly_xp },
  position,
  lastPositionsOffset,
  isAuthUser,
}: UserProps) {
  const isInPodium = position <= 3
  const isInSafeArea = position <= 5
  const isInDangerArea = position > lastPositionsOffset

  const icon =
    isInPodium && PODIUM.find((place) => place.position === position)?.icon

  const color = isInSafeArea ? 'safe' : isInDangerArea ? 'danger' : 'neutral'

  return (
    <Link
      href={`/profile/${id}`}
      className={twMerge(
        'border-2 flex items-center justify-between rounded-md p-3 w-full group hover:border-gray-100/90',
        isAuthUser ? 'border-green-700' : 'border-gray-800'
      )}
    >
      <div className="flex items-center gap-2 text-lg mr-2">
        <span className={positionStyles({ color })}>
          {isInPodium ? (
            <Image src={`/icons/${icon}`} width={32} height={32} alt="" />
          ) : (
            position
          )}
        </span>
        <UserAvatar avatarId={avatar_id} size={48} />
      </div>

      <strong
        className={twMerge(
          'text-gray-500 group-hover:text-gray-100 block truncate',
          isAuthUser ? 'text-gray-100' : 'text-gray-500'
        )}
      >
        {name}
      </strong>

      <strong className="text-gray-600 uppercase block w-12">
        {weekly_xp} xp
      </strong>
    </Link>
  )
}
