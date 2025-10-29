import { CollapsibleContent } from '@radix-ui/react-collapsible'

import type { Planet, Star } from '@stardust/core/space/entities'

import { Button } from '@/ui/shadcn/components/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/shadcn/components/alert-dialog'
import { Collapsible, CollapsibleTrigger } from '@/ui/shadcn/components/collapsible'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { AddItemButton } from '@/ui/lesson/widgets/components/AddItemButton'
import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import { Sortable } from '@/ui/global/widgets/components/Sortable'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'
import { PlanetForm } from '../PlanetForm'
import { Metric } from '../Metric'
import { StarItem } from './StarItem'

type Props = {
  isOpen: boolean
  planet: Planet
  stars: SortableItem<Star>[]
  onPlanetChange: (planetDto: PlanetDto) => void
  onOpenChange: (isOpen: boolean) => void
  onStarCreate: () => void
  onStarDelete: (starId: string) => void
  onPlanetDelete: () => void
  onDragEnd: (newItems: SortableItem<Star>[]) => void
}

export const PlanetCollapsibleView = ({
  isOpen,
  planet,
  stars,
  onOpenChange,
  onStarCreate,
  onPlanetChange,
  onPlanetDelete,
  onStarDelete,
  onDragEnd,
}: Props) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className='flex flex-col gap-2 w-full'
    >
      <div className='flex items-center justify-between gap-6 rounded-xl border border-zinc-900 bg-transparent p-4 py-6 pl-16 shadow-md'>
        <div className='flex items-center gap-3 min-w-0'>
          <StorageImage
            folder='planets'
            src={planet.image.value}
            alt={planet.name.value}
            className='w-16 h-16 rounded-full object-cover border-2 border-zinc-700 shadow'
          />
          <div className='flex flex-col min-w-0'>
            <div className='flex items-center gap-2'>
              <h3 className='text-base font-semibold text-zinc-300'>
                {planet.name.value}
              </h3>
              <PlanetForm
                onSubmit={(planetDto) =>
                  onPlanetChange({
                    ...planet.dto,
                    name: planetDto.name,
                    icon: planetDto.icon,
                    image: planetDto.image,
                  })
                }
                planetDto={planet.dto}
              >
                <Button variant='ghost' size='icon'>
                  <Icon
                    name='edition'
                    className='text-zinc-400 size-4 cursor-pointer hover:text-primary transition-colors'
                  />
                </Button>
              </PlanetForm>
            </div>
            <div className='grid place-items-center bg-green-700 rounded-lg p-1'>
              <StorageImage
                folder='planets'
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size='icon' className='size-8 ml-2'>
                <Icon
                  name='trash'
                  className='text-zinc-400 cursor-pointer hover:text-primary transition-colors'
                />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deletar planeta</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Tem certeza de que deseja deletar este
                  planeta e todas as suas estrelas?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className='bg-destructive' onClick={onPlanetDelete}>
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <CollapsibleContent className='flex flex-col gap-2 px-8 pb-2'>
        <div className='flex flex-col gap-2'>
          {stars.length === 0 && (
            <p className='text-center text-zinc-400'>Este planeta não possui estrela.</p>
          )}
          <Sortable.Container
            key={stars.map((star) => star.id).join()}
            items={stars}
            onDragEnd={onDragEnd}
          >
            {(items) => {
              return items.map((item) => {
                const star = item.data
                return (
                  <Sortable.Item key={item.id} id={item.id} iconSize={36}>
                    <StarItem star={star} onDelete={onStarDelete} />
                  </Sortable.Item>
                )
              })
            }}
          </Sortable.Container>
          <AddItemButton className='w-40 mx-auto' onClick={onStarCreate}>
            Adicionar estrela
          </AddItemButton>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
