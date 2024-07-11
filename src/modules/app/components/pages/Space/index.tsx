'use client'

import { Fab } from '@/modules/global/components/shared/Fab'
import { PageTransitionAnimation } from '@/modules/global/components/shared/PageTransitionAnimation'
import { useSpaceContext } from '@/modules/app/contexts/SpaceContext'

import { useSpacePage } from './useSpacePage'
import { Planet } from './Planet'
import { FAB_ICON } from './fab-icon'

export function SpacePage() {
  const { isTransitionVisible, lastUnlockedStarPosition, handleFabClick } = useSpacePage()
  const { space } = useSpaceContext()

  return (
    <div className="flex flex-col items-center bg-green-900 bg-[url('/images/space.png')] bg-center pb-6">
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <ul className=' mt-10 flex max-w-[75vw] flex-col items-start justify-center gap-12'>
        {space.planets.map((planet) => (
          <Planet
            key={planet.id}
            id={planet.id}
            name={planet.name.value}
            icon={planet.icon}
            image={planet.image}
          />
        ))}
      </ul>

      <Fab
        isVisible={lastUnlockedStarPosition !== 'in'}
        icon={FAB_ICON[lastUnlockedStarPosition]}
        label='Ir até a última estrela desbloqueada'
        onClick={handleFabClick}
      />
    </div>
  )
}
