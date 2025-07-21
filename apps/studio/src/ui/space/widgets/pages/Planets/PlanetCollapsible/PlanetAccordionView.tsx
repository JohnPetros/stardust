import React from 'react'
import { CollapsibleContent } from '@radix-ui/react-collapsible'

import type { Planet } from '@stardust/core/space/entities'

import { Button } from '@/ui/shadcn/components/button'
import { Collapsible, CollapsibleTrigger } from '@/ui/shadcn/components/collapsible'
import { Icon } from '../../../../../global/widgets/components/Icon'
import { Metric } from '../Metric'

type Props = {
  planet: Planet
}

export const PlanetCollapsibleView = ({ planet }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='flex flex-col gap-2'>
      <div className='flex items-center justify-between gap-4 rounded-lg border border-zinc-500 p-6'>
        <div>
          <div className='flex items-center gap-6'>
            <Icon name='draggable' />
            <div className='flex items-center gap-2'>
              <img src={planet.image.value} alt={planet.name.value} />
              <div>
                <div>
                  <h3>{planet.name.value}</h3>
                  <Icon name='edition' />
                </div>
                <img src={planet.icon.value} alt={planet.name.value} className='w-full' />
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Metric
              title='Qtd. de usuários'
              icon='user'
              value={
                <p className='text-sm font-semibold text-zinc-400'>
                  {planet.completionsCount.value}
                </p>
              }
            />
            <Metric
              title='Qtd. de estrelas'
              icon='star'
              value={
                <p className='text-sm font-semibold text-zinc-400'>
                  {planet.starsCount.value}
                </p>
              }
            />
          </div>
        </div>

        <CollapsibleTrigger asChild>
          <Button variant='ghost' size='icon' className='size-8'>
            <Icon name='arrow-down' />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='flex flex-col gap-2'>
        <div>Star 1</div>
        <div>Star 2</div>
        <div>Star 3</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
