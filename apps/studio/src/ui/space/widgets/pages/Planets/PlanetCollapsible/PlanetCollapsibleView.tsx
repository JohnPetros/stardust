import React from 'react'
import { CollapsibleContent } from '@radix-ui/react-collapsible'

import type { Planet } from '@stardust/core/space/entities'

import { Button } from '@/ui/shadcn/components/button'
import { Collapsible, CollapsibleTrigger } from '@/ui/shadcn/components/collapsible'
import { Icon } from '../../../../../global/widgets/components/Icon'
import { Metric } from '../Metric'
import { StarItem } from './StarItem'

type Props = {
  planet: Planet
}

export const PlanetCollapsibleView = ({ planet }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='flex flex-col gap-2'>
      <div className='flex items-center justify-between gap-6 rounded-xl border border-zinc-700 bg-zinc-800 p-4 py-6 shadow-md'>
        <div className='flex items-center gap-3 min-w-0'>
          <Icon name='draggable' className='text-zinc-500 mr-2' size={32} />
          <img
            src={planet.image.value}
            alt={planet.name.value}
            className='w-16 h-16 rounded-full object-cover border-2 border-zinc-700 shadow'
          />
          <div className='flex flex-col min-w-0'>
            <div className='flex items-center gap-2'>
              <h3 className='font-bold text-zinc-100 truncate max-w-[160px]'>
                {planet.name.value}
              </h3>
              <Icon
                name='edition'
                className='text-zinc-400 size-4 cursor-pointer hover:text-primary transition-colors'
              />
            </div>
            <div className='grid place-items-center bg-green-700 rounded-lg p-1'>
              <img
                src={planet.icon.value}
                alt={planet.name.value}
                className='w-6 h-6 mt-1 object-contain'
              />
            </div>
          </div>
        </div>
        <div className='flex items-center gap-6'>
          <Metric
            title='Qtd. de usuários'
            icon='user'
            value={
              <p className='text-base text-center font-semibold text-zinc-300'>
                {planet.completionsCount.value}
              </p>
            }
          />
          <Metric
            title='Qtd. de estrelas'
            icon='star'
            value={
              <p className='text-base text-center font-semibold text-zinc-300'>
                {planet.starsCount.value}
              </p>
            }
          />
          <CollapsibleTrigger asChild>
            <Button variant='ghost' size='icon' className='size-8 ml-2'>
              <Icon name={isOpen ? 'arrow-up' : 'arrow-down'} />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className='flex flex-col gap-2 px-8 pb-2'>
        <div className='flex flex-col gap-2'>
          {planet.stars.map((star, index) => (
            <StarItem
              key={star.id.value}
              star={star}
              isChallenge={index === planet.starsCount.value - 1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
