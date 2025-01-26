'use client'

import Link from 'next/link'

import { Fab } from '@/ui/global/widgets/components/Fab'
import { useSpaceContext } from '@/ui/space/contexts/SpaceContext'

import { useSpacePage } from './useSpacePage'
import { Planet } from './Planet'
import { FAB_ICON } from './fab-icon'
import { Particles } from './Particles'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { ROUTES } from '@/constants'

export function SpacePage() {
  const { lastUnlockedStarPosition, handleFabClick } = useSpacePage()
  const { planets, lastUnlockedStarId } = useSpaceContext()
  const { user } = useAuthContext()

  return (
    <>
      <div className='absolute top-0 bottom-0 left-0 right-0'>
        <Particles />
      </div>

      <div className='flex flex-col items-center pb-6'>
        {lastUnlockedStarId && (
          <ul className='mt-10 flex max-w-[75vw] flex-col items-start justify-center gap-12 z-40'>
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

        {user?.hasCompletedSpace.isTrue && (
          <Link
            href={ROUTES.lesson.ending}
            className='block z-50 mt-12 pb-6 hover:scale-105 transition-transform duration-200'
          >
            <p className='text-medium text-gray-50 text-center translate-y-6'>
              Agradecimentos.
            </p>
            <Animation name='galaxy' size={320} />
          </Link>
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
