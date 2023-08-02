'use client'
import { getImage } from '@/utils/functions'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { Variants, motion } from 'framer-motion'

const badgeVariants: Variants = {
  hover: {
    rotate: ['0deg', '15deg', '0deg', '-15deg', '0deg'],
    transition: {
      duration: 0.5,
    },
  },
}

interface BadgeProps {
  index: number
  name: string
  image: string
  currentRankingIndex: number
}

export function Badge({ index, name, image, currentRankingIndex }: BadgeProps) {
  const rankingImage = getImage('rankings', image)
  const isCurrentRanking = currentRankingIndex === index
  const isLocked = index > currentRankingIndex

  return (
    <div
      className={twMerge(
        'relative  flex flex-col items-center justify-center gap-2',
        isLocked ? 'brightness-75 opacity-75' : 'brightness-100 opacity-100'
      )}
    >
      <motion.div
        variants={badgeVariants}
        whileHover={!isLocked ? 'hover' : ''}
        className="cursor-pointer"
      >
        <Image src={rankingImage} width={80} height={80} alt="" />
      </motion.div>

      {isLocked && (
        <div className="absolute top-9">
          <Image
            src="/icons/lock.svg"
            width={24}
            height={24}
            alt="Ranking bloqueado"
          />
        </div>
      )}

      {isCurrentRanking && (
        <strong className="text-lg text-gray-100 font-semibold">{name}</strong>
      )}
    </div>
  )
}
