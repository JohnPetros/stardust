'use client'

import Image from 'next/image'
import { Star } from './Star'

import { motion, Variants } from 'framer-motion'

import { getImage } from '@/utils/functions'

import type { Planet } from '@/types/planet'

const planetSignAnimations: Variants = {
  float: {
    y: [6, -6, 6],
    transition: {
      repeat: Infinity,
      duration: 3,
    },
  },
}

interface PlanetProps {
  data: Planet
  lastUnlockedStarId: string
}

export function Planet({
  data: { name, image, icon, stars },
  lastUnlockedStarId,
}: PlanetProps) {
  const planetImage = getImage('planets', image)
  const planetIcon = getImage('planets', icon)

  return (
    <li>
      <div className="flex items-center gap-3">
        <Image src={planetImage} width={100} height={100} alt={name} />

        <motion.div
          variants={planetSignAnimations}
          animate="float"
          className="bg-green-800 max-w-sm p-3 flex items-center gap-3 rounded-lg"
        >
          <Image src={planetIcon} width={32} height={32} alt="" />
          <strong className="text-zinc-100 font-semibold">{name}</strong>
        </motion.div>
      </div>

      <ul className="pl-[2.2rem]">
        {stars.map((star) => (
          <Star
            key={star.id}
            data={star}
            isLastUnlockedStar={lastUnlockedStarId === star.id}
          />
        ))}
      </ul>
    </li>
  )
}
