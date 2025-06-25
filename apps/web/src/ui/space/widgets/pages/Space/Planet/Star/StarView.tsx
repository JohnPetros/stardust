'use client'

import type { RefObject } from 'react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { AnimatedImage } from './AnimatedImage'
import { AnimatedRocket } from './AnimatedRocket'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { Animation } from '@/ui/global/widgets/components/Animation'

const STAR_LIGHT = '0 0 12px #ffcf31a1'

type Props = {
  name: string
  number: number
  isUnlocked: boolean
  isLastUnlockedStar: boolean
  lastUnlockedStarRef: RefObject<HTMLLIElement>
  starAnimationRef: RefObject<AnimationRef>
  onClick: () => void
}

export const StarView = ({
  name,
  number,
  isUnlocked,
  isLastUnlockedStar,
  lastUnlockedStarRef,
  starAnimationRef,
  onClick,
}: Props) => {
  return (
    <li ref={isLastUnlockedStar ? lastUnlockedStarRef : null}>
      <div>
        <Image
          src={`/images/${isUnlocked ? 'unlocked-stardust.svg' : 'locked-stardust.svg'}`}
          width={32}
          height={64}
          alt=''
        />
      </div>
      <button
        type='button'
        onClick={onClick}
        disabled={!isUnlocked}
        className='mt-2 flex items-center gap-3'
      >
        <div className='relative'>
          {isUnlocked ? (
            <AnimatedImage shouldAnimate={isLastUnlockedStar}>
              <Animation
                ref={starAnimationRef}
                name='unlocked-star'
                size={100}
                hasLoop={false}
              />
            </AnimatedImage>
          ) : (
            <Image
              src='/images/locked-star.svg'
              width={80}
              height={80}
              className='-translate-x-6 max-w-none'
              alt=''
            />
          )}
          <span
            className={twMerge(
              'absolute top-[50%] block -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-yellow-700',
              isUnlocked ? 'left-[26%]' : ' left-[22%]',
            )}
          >
            {number}
          </span>
        </div>
        <div
          style={{ boxShadow: STAR_LIGHT }}
          className={twMerge(
            'grid place-content-center rounded-lg border-2 border-dashed bg-green-900 max-w-[220px] px-6 py-3',
            isUnlocked ? 'border-yellow-400' : 'border-gray-500',
          )}
        >
          <strong
            className={twMerge(
              'font-semibold',
              isUnlocked ? 'text-yellow-400' : 'text-gray-400',
            )}
          >
            {name}
          </strong>
        </div>

        <AnimatedRocket shouldAnimate={isLastUnlockedStar} />
      </button>
    </li>
  )
}
