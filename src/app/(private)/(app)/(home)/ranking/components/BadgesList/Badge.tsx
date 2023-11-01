'use client'
import { getImage } from '@/utils/helpers'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { Variants, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

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
  const badgeRef = useRef<HTMLDivElement | null>(null)

  const rankingImage = getImage('rankings', image)
  const isCurrentRanking = currentRankingIndex === index
  const isLocked = index > currentRankingIndex

  useEffect(() => {
    if (badgeRef.current && isCurrentRanking) {
      setTimeout(() => {
        badgeRef.current?.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
          inline: 'center',
        })
      }, 100)
    }
  }, [badgeRef.current])

  return (
    <div
      ref={badgeRef}
      className={twMerge(
        'relative flex flex-col items-center justify-center gap-2',
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
        <div className="absolute top-4">
          <Image
            src="/icons/lock.svg"
            width={24}
            height={24}
            alt="Ranking bloqueado"
          />
        </div>
      )}

      {isCurrentRanking && (
        <strong className="md:text-lg text-gray-100 text-center font-semibold">
          {name}
        </strong>
      )}
    </div>
  )
}
