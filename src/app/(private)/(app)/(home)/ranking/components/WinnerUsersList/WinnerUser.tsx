import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { ShinningAnimation } from '../../../components/ShinningAnimation'
import { UserAvatar } from '../../../components/UserAvatar'

import type { WinnerUser } from '@/@types/user'
import { PODIUM } from '@/utils/constants'

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
        className={twMerge('relative flex w-48 flex-col')}
        style={{
          height: place ? BASE_HEIGHT - 40 * place.position - 1 : BASE_HEIGHT,
        }}
      >
        <motion.div
          variants={avatarVariants}
          initial="hidden"
          animate="visible"
          className="flex h-72 flex-col items-center justify-center gap-1"
        >
          {position === 1 && (
            <span className="absolute -left-[4%] -top-[6%] md:left-[13.5%]">
              <ShinningAnimation size={140} />
            </span>
          )}
          <UserAvatar avatarId={avatar_id} size={70} />
          <strong className="mx-auto text-center text-lg font-medium text-gray-100">
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
            'relative my-auto mt-3 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-yellow-800 px-3',
            place.bgColor
          )}
        >
          <motion.span
            variants={podiumVariants}
            initial="hidden"
            animate="visible"
            className="absolute bottom-0 top-0 z-30 h-full w-full bg-gray-900"
          />

          <span className="grid h-12 w-20 place-content-center rounded-md bg-green-800 text-lg font-medium uppercase text-gray-100 shadow-sm">
            {xp} xp
          </span>
        </div>
      </div>
    )
}
