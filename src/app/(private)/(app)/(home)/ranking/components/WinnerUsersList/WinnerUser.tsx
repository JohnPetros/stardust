import Image from 'next/image'
import Lottie from 'lottie-react'
import { UserAvatar } from '../../../components/UserAvatar'

import { PODIUM } from '@/utils/constants'
import { twMerge } from 'tailwind-merge'

import { Variants, motion } from 'framer-motion'

import type { WinnerUser } from '@/@types/user'

import { ShinningAnimation } from '../../../components/ShinningAnimation'

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
        duration: 0.2,
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
        duration: 0.5,
      },
    },
  }

  if (place)
    return (
      <div
        className={twMerge('flex flex-col w-48 relative')}
        style={{
          height: place ? BASE_HEIGHT - 40 * place.position - 1 : BASE_HEIGHT,
        }}
      >
        <motion.div
          variants={avatarVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center gap-1 h-72"
        >
          {position === 1 && (
            <span className="absolute -top-[6%] -left-[4%] md:left-[13.5%]">
              <ShinningAnimation size={140} />
            </span>
          )}
          <UserAvatar avatarId={avatar_id} size={70} />
          <strong className="text-lg font-medium text-gray-100 text-center mx-auto">
            {name}
          </strong>
          <Image
            src={`/icons/${place.icon}`}
            width={32}
            height={32}
            alt={ICON_ALTS[place.order]}
          />
        </motion.div>

        <div
          className={twMerge(
            'relative w-full flex flex-col items-center justify-center my-auto px-3 mt-3 h-full bg-yellow-800 overflow-hidden',
            place.bgColor
          )}
        >
          <motion.span
            variants={podiumVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-900 z-30 top-0 bottom-0 w-full h-full absolute"
          />

          <span className="font-medium uppercase text-lg text-gray-100 bg-green-800 shadow-sm w-20 h-12 grid place-content-center rounded-md">
            {xp} xp
          </span>
        </div>
      </div>
    )
}
