'use client'

import { memo } from 'react'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'

import { Star } from '../Star'

import type { Planet as PlanetData } from '@/@types/planet'
import { useApi } from '@/services/api'

const planetSignAnimations: Variants = {
  float: {
    y: [6, -6, 6],
    transition: {
      repeat: Infinity,
      duration: 3,
    },
  },
}

type PlanetProps = {
  data: PlanetData
  lastUnlockedStarId: string
}

function PlanetComponent({
  data: { name, image, icon, stars },
  lastUnlockedStarId,
}: PlanetProps) {
  const api = useApi()

  const planetImage = api.getImage('planets', image)
  const planetIcon = api.getImage('planets', icon)

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

export const Planet = memo(PlanetComponent, (previousProps, currentProps) => {
  return previousProps.lastUnlockedStarId === currentProps.lastUnlockedStarId
})
