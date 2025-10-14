import type { Planet } from '@stardust/core/space/entities'

import { Button } from '@/ui/shadcn/components/button'
import { PlanetCollapsible } from './PlanetCollapsible'

type Props = {
  planets: Planet[]
}

export const PlanetsPageView = ({ planets }: Props) => {
  return (
    <div>
      <Button>Novo planeta</Button>
      <div className='flex flex-col gap-4 mt-6'>
        {planets.map((planet) => (
          <PlanetCollapsible key={planet.id.value} planet={planet} />
        ))}
      </div>
    </div>
  )
}
