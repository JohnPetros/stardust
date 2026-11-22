import Image from 'next/image'
import Link from 'next/link'

import type { Planet as PlanetEntity } from '@stardust/core/space/entities'

import { ROUTES } from '@/constants'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { Fab } from '@/ui/global/widgets/components/Fab'
import type { CurrentItemViewportPosition } from '@/ui/space/contexts/SpaceContext/types'

import { FAB_ICON } from './fab-icon'
import { GalaxyControl } from './GalaxyControl'
import { Particles } from './Particles'
import { Planet } from './Planet'
import { StarDetails } from './StarDetails'
import { StarDetailsSheet } from './StarDetailsSheet'
import { TrailEmpty } from './TrailEmpty'
import { TrailLoading } from './TrailLoading'
import type { SpacePageStatus } from './useSpacePage'

export type Props = {
  status: SpacePageStatus
  planets: PlanetEntity[]
  galaxyName: string
  hasGalaxyChoice: boolean
  shouldShowEnding: boolean
  isMobile: boolean
  isSheetOpen: boolean
  isFabVisible: boolean
  currentItemPosition: CurrentItemViewportPosition
  onFabClick: () => void
  onSheetClose: () => void
}

function PlanetList({ planets }: Pick<Props, 'planets'>) {
  return (
    <ul className='mt-10 flex max-w-[75vw] flex-col items-start justify-center z-40'>
      {planets.map((planet, index) => (
        <li key={planet.id.value}>
          {index > 0 && (
            <Image
              src='/images/locked-stardust.svg'
              width={32}
              height={64}
              alt=''
              className='ml-[2.2rem] block'
            />
          )}
          <Planet
            planet={planet}
            previousPlanetName={planets[index - 1]?.name.value ?? null}
          />
        </li>
      ))}
    </ul>
  )
}

function EndingLink() {
  return (
    <Link
      href={ROUTES.lesson.ending}
      className='block z-50 mt-12 pb-6 hover:scale-105 transition-transform duration-200'
    >
      <p className='text-medium text-gray-50 text-center translate-y-6'>
        Agradecimentos.
      </p>
      <Animation name='galaxy' size={320} />
    </Link>
  )
}

function Trail({
  planets,
  shouldShowEnding,
  isMobile,
}: Pick<Props, 'planets' | 'shouldShowEnding' | 'isMobile'>) {
  return (
    <div className='flex w-full items-start justify-center gap-10 px-4'>
      <div className='flex flex-col items-center'>
        <PlanetList planets={planets} />
        {shouldShowEnding && <EndingLink />}
      </div>

      {!isMobile && (
        <aside className='sticky top-24 z-40 mt-10 hidden w-[360px] shrink-0 lg:block'>
          <StarDetails />
        </aside>
      )}
    </div>
  )
}

function PageBackground() {
  return (
    <div className='pointer-events-none absolute top-0 bottom-0 left-0 right-0'>
      <Particles />
    </div>
  )
}

export function SpacePageView({
  status,
  planets,
  galaxyName,
  hasGalaxyChoice,
  shouldShowEnding,
  isMobile,
  isSheetOpen,
  isFabVisible,
  currentItemPosition,
  onFabClick,
  onSheetClose,
}: Props) {
  return (
    <>
      <PageBackground />

      {hasGalaxyChoice && (
        <div className='relative z-50 w-full md:pl-[136px] md:pr-[48px] md:pt-6 lg:pl-[160px]'>
          <GalaxyControl galaxyName={galaxyName} />
        </div>
      )}

      <div className='flex flex-col items-center pb-6'>
        {status === 'loading' && <TrailLoading />}
        {status === 'empty' && <TrailEmpty />}
        {status === 'ready' && (
          <Trail
            planets={planets}
            shouldShowEnding={shouldShowEnding}
            isMobile={isMobile}
          />
        )}

        <Fab
          isVisible={isFabVisible}
          icon={FAB_ICON[currentItemPosition]}
          label='Voltar à estrela atual'
          onClick={onFabClick}
        />
      </div>

      {isMobile && <StarDetailsSheet isOpen={isSheetOpen} onClose={onSheetClose} />}
    </>
  )
}
