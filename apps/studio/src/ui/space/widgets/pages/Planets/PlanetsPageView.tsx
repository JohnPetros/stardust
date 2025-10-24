import type { Planet } from '@stardust/core/space/entities'
import { PlanetForm } from './PlanetForm'
import { PlanetCollapsible } from './PlanetCollapsible'
import { Button } from '@/ui/shadcn/components/button'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'

type Props = {
  planets: Planet[]
  onPlanetFormSubmit: (planetDto: Pick<PlanetDto, 'name' | 'icon' | 'image'>) => void
}

export const PlanetsPageView = ({ planets, onPlanetFormSubmit }: Props) => {
  return (
    <div className='max-w-7xl mx-auto py-12'>
      <PlanetForm onSubmit={onPlanetFormSubmit}>
        <Button variant='outline'>Adicionar planeta</Button>
      </PlanetForm>
      <div className='flex flex-col gap-4 mt-6'>
        {planets.map((planet) => (
          <PlanetCollapsible key={planet.id.value} planet={planet} />
        ))}
      </div>
    </div>
  )
}
