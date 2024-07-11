'use client'

import { memo } from 'react'
import Image from 'next/image'

import { useApi } from '@/infra/api'
import { AnimatedSign } from './AnimatedSign'
import { useSpaceContext } from '@/modules/app/contexts/SpaceContext'
import { Star } from './Star'

type PlanetProps = {
  id: string
  name: string
  image: string
  icon: string
}

function PlanetComponent({ id, name, image, icon }: PlanetProps) {
  const { space } = useSpaceContext()
  const api = useApi()

  const planetImage = api.fetchImage('planets', image)
  const planetIcon = api.fetchImage('planets', icon)

  const unLockableStars = space.getUnlockableStarsByPlanet(id)

  return (
    <li>
      <div className='flex items-center gap-3'>
        <Image src={planetImage} width={100} height={100} alt={name} />

        <AnimatedSign>
          <Image src={planetIcon} width={32} height={32} alt='' />
          <strong className='font-semibold text-zinc-100'>{name}</strong>
        </AnimatedSign>
      </div>

      <ul className='pl-[2.2rem]'>
        {unLockableStars.map(({ item: star, isUnlocked }) => (
          <Star
            key={star.id}
            id={star.id}
            name={star.name.value}
            number={star.number}
            slug={star.slug.value}
            isChallenge={star.isChallenge}
            isUnlocked={isUnlocked}
            isLastUnlockedStar={space.lastUnlockedStarId === star.id}
          />
        ))}
      </ul>
    </li>
  )
}

export const Planet = memo(PlanetComponent, (previousProps, currentProps) => {
  return Object.is(previousProps, currentProps)
})
