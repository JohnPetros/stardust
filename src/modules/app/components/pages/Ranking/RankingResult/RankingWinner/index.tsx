'use client'

import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { AnimatedPodium } from './AnimatedPodium'
import { AnimatedAvatar } from './AnimatedAvatar'
import { Animation } from '@/modules/global/components/shared/Animation'
import { UserAvatar } from '@/modules/global/components/shared/UserAvatar'
import { PODIUM } from '../podium'

const BASE_HEIGHT = 400 // px

const ICON_ALTS = {
  '1st': 'Primeiro lugar',
  '2nd': 'Segundo lugar',
  '3rd': 'Terceiro lugar',
}

type RankingWinnerProps = {
  position: number
  name: string
  xp: number
  avatarImage: string
  avatarName: string
}

export function RankingWinner({
  position,
  avatarName,
  avatarImage,
  name,
  xp,
}: RankingWinnerProps) {
  const place = PODIUM.find((place) => place.position === position)

  if (place)
    return (
      <div
        className='relative flex w-48 flex-col'
        style={{
          height: place ? BASE_HEIGHT - 40 * place.position - 1 : BASE_HEIGHT,
        }}
      >
        <AnimatedAvatar>
          <div className='flex flex-col items-center justify-center gap-1'>
            {position === 1 && (
              <span className='absolute -left-[4%] -top-[8%] md:left-[13.5%]'>
                <Animation name='shinning' size={140} />
              </span>
            )}
            <UserAvatar avatarName={avatarName} avatarImage={avatarImage} size={70} />
            <strong className='mx-auto text-center text-lg font-medium text-gray-100'>
              {name}
            </strong>
            <Image
              src={`/icons/${place.icon}`}
              width={32}
              height={32}
              alt={ICON_ALTS[place.order]}
            />
          </div>
        </AnimatedAvatar>

        <div
          className={twMerge(
            'relative my-auto mt-3 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-yellow-800 px-3',
            place.bgColor
          )}
        >
          <AnimatedPodium baseHeight={BASE_HEIGHT} position={position} />
          <span className='grid h-12 w-20 place-content-center rounded-md bg-green-800 text-lg font-medium uppercase text-gray-100 shadow-sm'>
            {xp} xp
          </span>
        </div>
      </div>
    )
}
