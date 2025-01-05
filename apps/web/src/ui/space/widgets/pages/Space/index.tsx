'use client'

import { Fab } from '@/ui/global/widgets/components/Fab'
import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'

import { useSpacePage } from './useSpacePage'
import { Planet } from './Planet'
import { FAB_ICON } from './fab-icon'
import { Particles } from './Particles'

export function SpacePage() {
  const { lastUnlockedStarPosition, handleFabClick } = useSpacePage()
  const { planets, lastUnlockedStarId } = useSpaceContext()

  return (
    <>
      <div className='absolute top-0 bottom-0 left-0 right-0'>
        <Particles />
      </div>

      <div className='flex flex-col items-center pb-6'>
        {lastUnlockedStarId && (
          <ul className=' mt-10 flex max-w-[75vw] flex-col items-start justify-center gap-12 z-40'>
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
    </>
  )
}
