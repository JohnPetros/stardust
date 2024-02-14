'use client'

import { CaretDown, CaretUp, Icon } from '@phosphor-icons/react'

import { Planet } from '../Planet'

import { useSpace } from './useSpace'

import type { Planet as PlanetData } from '@/@types/Planet'
import { StarViewPortPosition } from '@/contexts/SpaceContext/types/StarViewPortPosition'
import { Fab } from '@/global/components/Fab'
import { PageTransitionAnimation } from '@/global/components/PageTransitionAnimation'

export const FAB_ICON: Record<StarViewPortPosition, Icon> = {
  above: CaretDown,
  bellow: CaretUp,
  in: CaretDown,
}

interface SpaceProps {
  planets: PlanetData[]
  lastUnlockedStarId: string
}

export function Space({ planets, lastUnlockedStarId }: SpaceProps) {
  const { isTransitionVisible, lastUnlockedStarPosition, handleFabClick } =
    useSpace()

  return (
    <div className="flex flex-col items-center bg-green-900 bg-[url('/images/space.png')] bg-center pb-6">
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <ul className=" mt-10 flex max-w-[75vw] flex-col items-start justify-center gap-12">
        {planets.map((planet) => (
          <Planet
            key={planet.id}
            data={planet}
            lastUnlockedStarId={lastUnlockedStarId}
          />
        ))}
      </ul>

      <Fab
        isVisible={lastUnlockedStarPosition !== 'in'}
        icon={FAB_ICON[lastUnlockedStarPosition]}
        label="Ir até a última estrela desbloqueada"
        onClick={handleFabClick}
      />
    </div>
  )
}
