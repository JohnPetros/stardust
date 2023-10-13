'use client'

import { motion, Variants } from 'framer-motion'
import Image from 'next/image'

import { Star } from './Star'

import type { Planet } from '@/@types/planet'
import { getImage } from '@/utils/functions'

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
          className="flex max-w-sm items-center gap-3 rounded-lg bg-green-800 p-3"
        >
          <Image src={planetIcon} width={32} height={32} alt="" />
          <strong className="font-semibold text-zinc-100">{name}</strong>
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
