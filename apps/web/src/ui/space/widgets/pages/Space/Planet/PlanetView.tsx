'use client'

import Image from 'next/image'

import type { Star as StarEntity } from '@stardust/core/space/entities'

import { AnimatedSign } from './AnimatedSign'
import { Star } from './Star'

type PlanetProps = {
  name: string
  image: string
  icon: string
  stars: StarEntity[]
}

export const PlanetView = ({ name, image, icon, stars }: PlanetProps) => {
  return (
    <div>
      <div className='flex items-center gap-3'>
        <Image src={image} width={100} height={100} alt={name} />

        <AnimatedSign>
          <Image src={icon} width={32} height={32} alt='' />
          <strong className='font-semibold text-zinc-100'>{name}</strong>
        </AnimatedSign>
      </div>

      <ul className='pl-[2.2rem]'>
        {stars.map((star) => (
          <li key={star.id.value}>
            <Star id={star.id} name={star.name} number={star.number} slug={star.slug} />
          </li>
        ))}
      </ul>
    </div>
  )
}
