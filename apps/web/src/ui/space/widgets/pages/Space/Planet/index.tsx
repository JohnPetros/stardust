'use client'

import type { Planet as PlanetEntity } from '@stardust/core/space/entities'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useFileStorage } from '@/ui/global/hooks/useFileStorage'
import { useOpenPlanetAction } from '@/ui/space/hooks/useOpenPlanetAction'
import { useSpaceContext } from '@/ui/space/hooks/useSpaceContext'
import { PlanetView } from './PlanetView'
import { usePlanet } from './usePlanet'

type PlanetProps = {
  planet: PlanetEntity
  previousPlanetName: string | null
}

export const Planet = ({ planet, previousPlanetName }: PlanetProps) => {
  const space = useSpaceContext()
  const { openPlanet, openingPlanetId } = useOpenPlanetAction()
  const { showError } = useToastContext()
  const folder = FileStorageFolderPath.createAsImagesPlanets()
  const image = useFileStorage(folder, planet.image.value)
  const { view, handleOpen } = usePlanet({
    planet,
    space,
    openingPlanetId,
    openPlanet,
    showError,
  })

  return (
    <PlanetView
      {...view}
      image={image}
      stars={planet.stars}
      planetId={planet.id}
      previousPlanetName={previousPlanetName}
      currentItemRef={space.currentItemRef}
      onOpen={handleOpen}
    />
  )
}
