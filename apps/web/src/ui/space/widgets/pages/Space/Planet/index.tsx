'use client'

import { memo } from 'react'
import type { Star as StarEntity } from '@stardust/core/space/entities'

import { useImage } from '@/ui/global/hooks/useImage'
import { PlanetView } from './PlanetView'

type PlanetProps = {
  name: string
  image: string
  icon: string
  stars: StarEntity[]
}

export const Widget = ({ name, image, icon, stars }: PlanetProps) => {
  const planetImage = useImage('planets', image)
  const planetIconImage = useImage('planets', icon)

  return (
    <PlanetView name={name} image={planetImage} icon={planetIconImage} stars={stars} />
  )
}

export const Planet = memo(Widget, (previousProps, currentProps) => {
  return Object.is(previousProps, currentProps)
})
