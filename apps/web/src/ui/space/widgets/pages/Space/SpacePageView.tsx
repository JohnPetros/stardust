import Link from 'next/link'

import type { Planet as PlanetEntity } from '@stardust/core/space/entities'

import { ROUTES } from '@/constants'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { Fab } from '@/ui/global/widgets/components/Fab'
import type { LastUnlockedStarViewPortPosition } from '@/ui/space/contexts/SpaceContext/types'

import { FAB_ICON } from './fab-icon'
import { GalaxyControl } from './GalaxyControl'
import { Particles } from './Particles'
import { Planet } from './Planet'

export type Props = {
  planets: PlanetEntity[]
  lastUnlockedStarId: string | null
  lastUnlockedStarPosition: LastUnlockedStarViewPortPosition
  galaxyName: string
  hasGalaxyChoice: boolean
  shouldShowEnding: boolean
  onFabClick: () => void
}

export function SpacePageView({
  planets,
  lastUnlockedStarId,
  lastUnlockedStarPosition,
  galaxyName,
  hasGalaxyChoice,
  shouldShowEnding,
  onFabClick,
}: Props) {
  return (
    <>
      <div className='pointer-events-none absolute top-0 bottom-0 left-0 right-0'>
        <Particles />
      </div>

      {hasGalaxyChoice && (
        <div className='relative z-50 w-full md:pl-[136px] md:pr-[48px] md:pt-6 lg:pl-[160px]'>
          <GalaxyControl galaxyName={galaxyName} />
        </div>
      )}

      <div className='flex flex-col items-center pb-6'>
        {lastUnlockedStarId && (
          <ul className='mt-10 flex max-w-[75vw] flex-col items-start justify-center gap-12 z-40'>
            {planets.map((planet) => (
              <li key={planet.id.value}>
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

        {shouldShowEnding && (
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
          onClick={onFabClick}
        />
      </div>
    </>
  )
}
