import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'

import { GalaxyItem } from '../GalaxyItem'

export type Props = {
  galaxies: GalaxySummaryDto[]
  pendingGalaxySlug: string | null
  onEnter: (galaxy: GalaxySummaryDto) => void
}

export function GalaxiesMapView({ galaxies, pendingGalaxySlug, onEnter }: Props) {
  return (
    <ul className='mt-[32px] flex flex-col gap-[32px] lg:mx-auto lg:w-full lg:max-w-[1232px] lg:gap-5'>
      {galaxies.map((galaxy, index) => {
        const isStaggeredToStart = index % 2 === 0

        return (
          <li
            key={galaxy.id}
            className={
              isStaggeredToStart
                ? 'lg:ml-[72px] lg:w-[632px]'
                : 'lg:ml-auto lg:mr-[48px] lg:w-[632px]'
            }
          >
            <GalaxyItem
              galaxy={galaxy}
              side={isStaggeredToStart ? 'start' : 'end'}
              isPending={pendingGalaxySlug === galaxy.slug}
              onEnter={onEnter}
            />
          </li>
        )
      })}
    </ul>
  )
}
