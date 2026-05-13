'use client'

import { memo } from 'react'
import type { Star as StarEntity } from '@stardust/core/space/entities'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { useFileStorage } from '@/ui/global/hooks/useFileStorage'
import { PlanetView } from './PlanetView'

type PlanetProps = {
  name: string
  image: string
  icon: string
  stars: StarEntity[]
}

export const Widget = ({ name, image, icon, stars }: PlanetProps) => {
  const planetImage = useFileStorage(FileStorageFolderPath.createAsImagesPlanets(), image)
  console.log(FileStorageFolderPath.createAsImagesPlanets())
  const planetIconImage = useFileStorage(
    FileStorageFolderPath.createAsImagesPlanets(),
    icon,
  )

  return (
    <PlanetView name={name} image={planetImage} icon={planetIconImage} stars={stars} />
  )
}

export const Planet = memo(Widget, (previousProps, currentProps) => {
  return Object.is(previousProps, currentProps)
})
