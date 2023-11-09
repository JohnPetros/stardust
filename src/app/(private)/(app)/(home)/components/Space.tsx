'use client'

import { useEffect, useState } from 'react'
import { CaretDown, CaretUp, Icon } from '@phosphor-icons/react'

import { PageTransitionAnimation } from '../../../../components/PageTransitionAnimation'

import { Fab } from './Fab'
import { Planet } from './Planet'

import { StarViewPortPosition } from '@/contexts/SpaceContext'
import { useSpace } from '@/contexts/SpaceContext'
import { usePlanet } from '@/hooks/usePlanet'

const fabIcon: Record<StarViewPortPosition, Icon> = {
  above: CaretDown,
  bellow: CaretUp,
  in: CaretDown,
}

export function Space() {
  const { lastUnlockedStarPosition, scrollIntoLastUnlockedStar } = useSpace()
  const { planets, lastUnlockedStarId } = usePlanet()
  const [isTransitionVisible, setIsTransitionVisible] = useState(
    !planets?.length
  )

  function handleFabClick() {
    scrollIntoLastUnlockedStar()
  }

  useEffect(() => {
    if (planets?.length && isTransitionVisible) {
      setTimeout(() => setIsTransitionVisible(false), 3500)
    }
  }, [planets, isTransitionVisible])

  return (
    <div
      className="flex flex-col items-center bg-green-900 bg-[url('/images/space.png')] bg-center pb-6"
    >
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <ul className=" mt-10 flex max-w-[75vw] flex-col items-start justify-center gap-12">
        {planets?.map((planet) => (
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
