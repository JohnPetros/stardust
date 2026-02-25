import type { Planet } from '@stardust/core/space/entities'
import { PlanetForm } from './PlanetForm'
import { PlanetCollapsible } from './PlanetCollapsible'
import { Button } from '@/ui/shadcn/components/button'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'
import { SortableList } from '@/ui/global/widgets/components/SortableList'
import type { SortableItem } from '@/ui/global/widgets/components/SortableList/types'

type Props = {
  planets: SortableItem<Planet>[]
  onPlanetFormSubmit: (planetDto: Pick<PlanetDto, 'name' | 'icon' | 'image'>) => void
  onDragEnd: (reorderedPlanets: SortableItem<Planet>[]) => void
}

export const PlanetsPageView = ({ planets, onPlanetFormSubmit, onDragEnd }: Props) => {
  return (
    <div className='max-w-340 mx-auto py-12'>
      <PlanetForm onSubmit={onPlanetFormSubmit}>
        <Button variant='outline'>Adicionar planeta</Button>
      </PlanetForm>
      <div className='flex flex-col gap-4 mt-6'>
        <SortableList.Container items={planets} onDragEnd={onDragEnd}>
          {(items) =>
            items.map((item) => {
              return (
                <SortableList.Item
                  key={item.id}
                  id={item.id}
                  iconSize={36}
                  className='top-16'
                >
                  <PlanetCollapsible planet={item.data} />
                </SortableList.Item>
              )
            })
          }
        </SortableList.Container>
      </div>
    </div>
  )
}
