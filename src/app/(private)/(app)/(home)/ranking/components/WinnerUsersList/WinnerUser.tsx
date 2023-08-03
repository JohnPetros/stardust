import Image from 'next/image'
import Lottie from 'lottie-react'
import { UserAvatar } from '../../../components/UserAvatar'

import { PODIUM } from '@/utils/constants'
import { twMerge } from 'tailwind-merge'

import type { WinnerUser } from '@/types/user'

import RewardShinning from '../../../../../../../../public/animations/reward-shinning.json'

const BASE_HEIGHT = 480 // px

const ICON_ALTS = {
  '1st': 'Primeiro lugar',
  '2nd': 'Segundo lugar',
  '3rd': 'Terceiro lugar',
}

interface WinnerUserProps {
  data: WinnerUser
}

export function WinnerUser({
  data: { position, avatar_id, name, xp },
}: WinnerUserProps) {
  const place = PODIUM.find((place) => place.position === position)

  if (place)
    return (
      <div
        className={twMerge('flex flex-col w-48 ')}
        style={{ height: BASE_HEIGHT - 40 * place.position - 1 }}
      >
        <div className="relative flex flex-col items-center justify-center gap-1">
          {position === 1 && (
            <Lottie
              animationData={RewardShinning}
              style={{ position: 'absolute', top: -40, width: 140 }}
              loop={true}
            />
          )}
          <UserAvatar avatarId={avatar_id} size={70} />
          <strong className="text-lg font-medium text-gray-100 text-center mx-auto">
            {name}
          </strong>
          <Image
            src={`/icons/${place.icon}`}
            width={24}
            height={24}
            alt={ICON_ALTS[place.order]}
          />
        </div>

        <div
          className={twMerge(
            'w-full flex flex-col items-center justify-center my-auto px-3 mt-3 h-full bg-yellow-800',
            place.bgColor
          )}
        >
          <span className="font-medium text-lg text-gray-100 bg-green-800 w-16 h-12 grid place-content-center rounded-md">
            {place.order}
          </span>
          <span
            className={twMerge(
              'uppercase text-gray-100 font-semibold rounded p-1',
              place.bgColor
            )}
          >
            {xp} xp
          </span>
        </div>
      </div>
    )
}
