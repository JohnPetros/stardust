import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'
import { PODIUM } from '../../RankingResult/podium'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { RankingPosition } from '@stardust/core/ranking/structs'

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

type RankingUserProps = {
  id: string
  name: string
  avatarImage: string
  avatarName: string
  xp: number
  position: number
  losersPositionOffset: number
  canShowXp?: boolean
}

export function RankingUser({
  id,
  name,
  avatarImage,
  avatarName,
  xp,
  position,
  losersPositionOffset,
  canShowXp = true,
}: RankingUserProps) {
  const { user } = useAuthContext()

  const rankingPosition = RankingPosition.create(position)

  const icon = rankingPosition.isInPodiumArea
    ? PODIUM.find((place) => place.position === position)?.icon
    : ''

  let color: 'safe' | 'danger' | 'neutral'
  if (rankingPosition.isInWinningArea) color = 'safe'
  else if (rankingPosition.isInDangerArea(losersPositionOffset)) color = 'danger'
  else color = 'neutral'

  if (user)
    return (
      <Link
        href={`/profile/${id}`}
        className={twMerge(
          'group flex w-full items-center justify-between rounded-md border-2 p-3 hover:border-gray-100/90',
          user.id === id ? 'border-green-700' : 'border-gray-800',
        )}
      >
        <div className='mr-2 flex items-center gap-2 text-lg'>
          <span className={positionStyles({ color })}>
            {rankingPosition.isInPodiumArea ? (
              <Image src={`/icons/${icon}`} width={32} height={32} alt='' />
            ) : (
              position
            )}
          </span>
          <UserAvatar avatarImage={avatarImage} avatarName={avatarName} size={48} />
        </div>

        <strong
          className={twMerge(
            'block truncate text-gray-500 group-hover:text-gray-100/90',
            user?.id === id ? 'text-gray-100' : 'text-gray-500',
          )}
        >
          {name}
        </strong>

        <strong className='block w-24 text-right uppercase text-gray-600 group-hover:text-gray-100/90'>
          {canShowXp && `${xp} xp`}
        </strong>
      </Link>
    )
}
