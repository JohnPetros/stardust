import Image from 'next/image'
import Lottie from 'lottie-react'
import { UserAvatar } from '../../../components/UserAvatar'

import { PODIUM } from '@/utils/constants'
import { twMerge } from 'tailwind-merge'

import { Variants, motion } from 'framer-motion'

import type { WinnerUser } from '@/types/user'

import RewardShinning from '../../../../../../../../public/animations/reward-shinning.json'

const BASE_HEIGHT = 480 // px
const BASE_DELAY = 0.8 // s

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

  const delay = place ? BASE_DELAY * place.position - 1 : BASE_DELAY

  const avatarVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 64,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2,
        duration: 0.4,
      },
    },
  }

  const podiumVariants: Variants = {
    hidden: {
      height: place ? BASE_HEIGHT - 40 * place.position - 1 : BASE_HEIGHT,
    },
    visible: {
      height: 0,
      transition: {
        delay: place ? BASE_DELAY * place.position - 1 : BASE_DELAY,
        duration: 0.6,
      },
    },
  }

  if (place)
    return (
      <div
        className={twMerge('flex flex-col w-48 ')}
        style={{
          height: place ? BASE_HEIGHT - 40 * place.position - 1 : BASE_HEIGHT,
        }}
      >
        <motion.div
          variants={avatarVariants}
          initial="hidden"
          animate="visible"
          className="relative flex flex-col items-center justify-center gap-1 h-64"
        >
          {position === 1 && (
            <Lottie
              animationData={RewardShinning}
              style={{ position: 'absolute', top: -24, width: 140 }}
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
        </motion.div>

        <div
          className={twMerge(
            'relative w-full flex flex-col items-center justify-center my-auto px-3 mt-3 h-full bg-yellow-800',
            place.bgColor
          )}
        >
          <motion.span
            variants={podiumVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-900 z-30 top-0 w-full absolute"
          ></motion.span>

          <span className="font-medium text-lg text-gray-100 bg-green-800 shadow-sm w-16 h-12 grid place-content-center rounded-md">
            {place.order}
          </span>
          <span
            className={twMerge(
              'uppercase text-gray-100 font-medium rounded p-1',
              place.bgColor
            )}
          >
            {xp} xp
          </span>
        </div>
      </div>
    )
}
