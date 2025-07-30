'use client'

import { memo } from 'react'
import Image from 'next/image'

import type { Star as StarEntity } from '@stardust/core/space/entities'

import { useImage } from '@/ui/global/hooks/useImage'
import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { AnimatedSign } from './AnimatedSign'
import { Star } from './Star'

type PlanetProps = {
  name: string
  image: string
  icon: string
  stars: StarEntity[]
}

function PlanetComponent({ name, image, icon, stars }: PlanetProps) {
  const { lastUnlockedStarId } = useSpaceContext()
  const { user } = useAuthContext()
  const planetImage = useImage('planets', image)
  const planetIconImage = useImage('planets', icon)

  return (
    <div>
      <div className='flex items-center gap-3'>
        <Image src={planetImage} width={100} height={100} alt={name} />

        <AnimatedSign>
          <Image src={planetIconImage} width={32} height={32} alt='' />
          <strong className='font-semibold text-zinc-100'>{name}</strong>
        </AnimatedSign>
      </div>

      {user && lastUnlockedStarId && (
        <ul className='pl-[2.2rem]'>
          {stars.map((star) => (
            <li key={star.id.value}>
              <Star
                id={star.id.value}
                name={star.name.value}
                number={star.number.value}
                slug={star.slug.value}
                isLastUnlockedStar={lastUnlockedStarId === star.id.value}
                isUnlocked={user.hasUnlockedStar(star.id).isTrue}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const Planet = memo(PlanetComponent, (previousProps, currentProps) => {
  return Object.is(previousProps, currentProps)
})
