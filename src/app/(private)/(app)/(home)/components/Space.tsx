'use client'

import { useEffect, useState } from 'react'
import { CaretDown, CaretUp, Icon } from '@phosphor-icons/react'

import { Fab } from '../../../../components/Fab'
import { PageTransitionAnimation } from '../../../../components/PageTransitionAnimation'

import { Planet } from './Planet'

import type { Planet as PlanetData } from '@/@types/planet'
import { StarViewPortPosition } from '@/contexts/SpaceContext'
import { useSpaceContext } from '@/contexts/SpaceContext'
import { usePlanets } from '@/hooks/usePlanets'

const fabIcon: Record<StarViewPortPosition, Icon> = {
  above: CaretDown,
  bellow: CaretUp,
  in: CaretDown,
}

interface SpaceProps {
  planets: PlanetData[]
}

export function Space({ planets }: SpaceProps) {
  const { lastUnlockedStarPosition, scrollIntoLastUnlockedStar } =
    useSpaceContext()
  const { lastUnlockedStarId, data: verifiedPlanets } = usePlanets(planets)
  const [isTransitionVisible, setIsTransitionVisible] = useState(
    !verifiedPlanets?.length
  )

  function handleFabClick() {
    scrollIntoLastUnlockedStar()
  }

  useEffect(() => {
    if (verifiedPlanets?.length && isTransitionVisible) {
      setTimeout(() => setIsTransitionVisible(false), 3500)
    }
  }, [verifiedPlanets, isTransitionVisible])

  return (
    <div className="flex flex-col items-center bg-green-900 bg-[url('/images/space.png')] bg-center pb-6">
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <ul className=" mt-10 flex max-w-[75vw] flex-col items-start justify-center gap-12">
        {verifiedPlanets?.map((planet) => (
          <Planet
            key={planet.id}
            data={planet}
            lastUnlockedStarId={lastUnlockedStarId}
          />
        ))}
      </ul>

      <Fab
        isVisible={lastUnlockedStarPosition !== 'in'}
        icon={fabIcon[lastUnlockedStarPosition]}
        label="Ir até a última estrela desbloqueada"
        onClick={handleFabClick}
      />
    </div>
  )
}
