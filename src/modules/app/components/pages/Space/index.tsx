'use client'

import { Fab } from '@/modules/global/components/shared/Fab'
import { PageTransitionAnimation } from '@/modules/global/components/shared/PageTransitionAnimation'
import { useSpaceContext } from '@/modules/app/contexts/SpaceContext'

import { useSpacePage } from './useSpacePage'
import { Planet } from './Planet'
import { FAB_ICON } from './fab-icon'

export function SpacePage() {
  const { isTransitionVisible, lastUnlockedStarPosition, handleFabClick } = useSpacePage()
  const { planets, lastUnlockedStarId } = useSpaceContext()

  return (
    <div className="flex flex-col items-center bg-green-900 bg-[url('/images/space.png')] bg-center pb-6">
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      {lastUnlockedStarId && (
        <ul className=' mt-10 flex max-w-[75vw] flex-col items-start justify-center gap-12'>
          {planets.map((planet) => (
            <li key={planet.id}>
              <Planet
                name={planet.name.value}
                icon={planet.icon.value}
                image={planet.image.value}
                stars={planet.stars}
              />
            </li>
          ))}
        </ul>
      )}

      <Fab
        isVisible={lastUnlockedStarPosition !== 'in'}
        icon={FAB_ICON[lastUnlockedStarPosition]}
        label='Ir até a última estrela desbloqueada'
        onClick={handleFabClick}
      />
    </div>
  )
}
