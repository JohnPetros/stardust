'use client'

import { motion, Variants } from 'framer-motion'
import Lottie from 'lottie-react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import UnlockedStar from '../../../../../../../public/animations/unlocked-star.json'

import { useStar } from './useStar'

import type { Star } from '@/@types/Star'

const STAR_LIGHT = '0 0 12px #ffcf31a1'

const starVariants: Variants = {
  default: {
    scale: 1,
  },
  pulse: {
    scale: 1.15,
    transition: {
      repeat: Infinity,
      repeatType: 'mirror',
      duration: 0.4,
    },
  },
}

const rocketVariants: Variants = {
  hidden: {
    opacity: 0,
    y: '-100vh',
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.5,
      type: 'spring',
    },
  },
}

type StarProps = {
  id: string
  name: string
  slug: string
  number: number
  isUnlocked: boolean
  isChallenge: boolean
  isLastUnlockedStar: boolean
}

export function Star({
  id,
  name,
  number,
  isChallenge,
  isUnlocked,
  slug,
  isLastUnlockedStar,
}: StarProps) {
  const { starRef, lastUnlockedStarRef, spaceRocket, handleStarClick } =
    useStar({ id, slug, isChallenge }, isLastUnlockedStar)

  console.log({ isChallenge })

  return (
    <li ref={isLastUnlockedStar ? lastUnlockedStarRef : null}>
      <div>
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
        className="mt-2 flex items-center gap-3"
        onClick={handleStarClick}
        disabled={!isUnlocked}
      >
        <div className="relative">
          {isUnlocked ? (
            <motion.div
              variants={starVariants}
              initial="default"
              animate={isLastUnlockedStar ? 'pulse' : ''}
              className="-ml-[36px]"
            >
              <Lottie
                lottieRef={starRef}
                animationData={UnlockedStar}
                style={{ width: 100 }}
                loop={false}
              />
            </motion.div>
          ) : (
            <Image
              src={'/images/locked-star.svg'}
              width={80}
              height={80}
              className="-translate-x-6"
              alt=""
            />
          )}
          <span
            className={twMerge(
              'absolute top-[50%] block -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-yellow-700',
              isUnlocked ? 'left-[26%]' : ' left-[22%]'
            )}
          >
            {number}
          </span>
        </div>
        <div
          style={{ boxShadow: STAR_LIGHT }}
          className={twMerge(
            'grid max-w-[220px] place-content-center rounded-lg border-2 border-dashed bg-green-900 px-6 py-3',
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

        <motion.div
          variants={rocketVariants}
          initial="hidden"
          animate="visible"
          className="h-20 w-20"
        >
          {isLastUnlockedStar && spaceRocket?.image && (
            <div className="relative h-20 w-20 rotate-180">
              <Image
                src={spaceRocket.image}
                alt={`Foguete ${spaceRocket.name}`}
                fill
              />
            </div>
          )}
        </motion.div>
      </button>
    </li>
  )
}
