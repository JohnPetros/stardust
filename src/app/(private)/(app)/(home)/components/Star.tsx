'use client'
import { useRef } from 'react'
import { Star } from '@/types/star'

import Image from 'next/image'
import { Animation } from '@/app/components/Animation'
import { LottieRef } from 'lottie-react'
import { twMerge } from 'tailwind-merge'
import { Variants, motion } from 'framer-motion'

import UnlockedStar from '../../../../../../public/animations/unlocked-star.json'

const starLight = '0 0 12px #ffcf31a1'

const starVariants: Variants = {
  default: {
    scale: 1,
  },
  pulse: {
    scale: 1.1,
    transition: {
      repeat: Infinity,
      repeatType: 'mirror',
      duration: 0.4,
    },
  },
}

interface StarProps {
  data: Star
  isLastUnlockedStar: boolean
}

export function Star({
  data: { name, number, isChallenge, isUnlocked },
  isLastUnlockedStar,
}: StarProps) {
  const starRef = useRef(null) as LottieRef

  function handleStarClick() {
    starRef.current?.goToAndPlay(0)
  }

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
      <button
        className="flex items-center gap-3 mt-2"
        onClick={handleStarClick}
      >
        <div className="relative">
          {isUnlocked ? (
            <motion.div
              variants={starVariants}
              initial="default"
              animate={isLastUnlockedStar ? 'pulse' : ''}
              className="-ml-2"
            >
              <Animation
                animationRef={starRef}
                src={UnlockedStar}
                size={100}
                hasLoop={false}
              />
            </motion.div>
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
      </button>
    </li>
  )
}
