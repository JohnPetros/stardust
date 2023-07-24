'use client'
import { Animation } from '@/app/components/Animation'
import { Star } from '@/types/star'
import Image from 'next/image'

import UnlockedStar from '../../../../../../public/animations/unlocked-star.json'
import { twMerge } from 'tailwind-merge'

const starLight = '0 0 12px #ffcf31a1'

interface StarProps {
  data: Star
}

export function Star({
  data: { name, number, isChallenge, isUnlocked },
}: StarProps) {
  return (
    <li>
      <div className="mx-8">
        <Image
          src={`/images/${
            isUnlocked ? 'unlocked-stardust.svg' : 'locked-stardust.svg'
          }`}
          width={32}
          height={64}
          alt=""
        />
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="relative">
          {isUnlocked ? (
            <div className="-ml-2">
              <Animation src={UnlockedStar} size={100} hasLoop={false} />
            </div>
          ) : (
            <Image
              src={'/images/locked-star.svg'}
              width={85}
              height={85}
              alt=""
            />
          )}
          <span
            className={twMerge(
              'absolute block text-lg font-semibold top-[52%] -translate-x-1/2 -translate-y-1/2 text-yellow-700',
              isUnlocked ? 'left-[48%]' : ' left-[50%]'
            )}
          >
            {number}
          </span>
        </div>
        <div
          style={{ boxShadow: starLight }}
          className={twMerge(
            'border-2 border-dashed rounded-lg px-6 py-3 max-w-[164px] grid place-content-center',
            isUnlocked ? 'border-yellow-400' : 'border-gray-500'
          )}
        >
          <strong
            className={twMerge(
              'font-semibold',
              isUnlocked ? 'text-yellow-400' : 'text-gray-400'
            )}
          >
            {name}
          </strong>
        </div>
      </div>
    </li>
  )
}
