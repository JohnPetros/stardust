'use client'

import { memo } from 'react'
import Image from 'next/image'

import type { Star as StarEntity } from '@/@core/domain/entities'

import { useApi } from '@/infra/api'
import { useSpaceContext } from '@/modules/app/contexts/SpaceContext'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
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
  const api = useApi()

  const planetImage = api.fetchImage('planets', image)
  const planetIconImage = api.fetchImage('planets', icon)

  console.log({ lastUnlockedStarId })

  return (
    <li>
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
            <li key={star.id}>
              <Star
                id={star.id}
                name={star.name.value}
                number={star.number.value}
                slug={star.slug.value}
                isChallenge={star.isChallenge.true}
                isLastUnlockedStar={lastUnlockedStarId === star.id}
                isUnlocked={user.hasUnlockedStar(star.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export const Planet = memo(PlanetComponent, (previousProps, currentProps) => {
  return Object.is(previousProps, currentProps)
})
