import type { GuideDto } from '@stardust/core/manual/entities/dtos'
import type { GuideCategory } from '@stardust/core/manual/structures'

import type { SortableItem } from '@/ui/global/widgets/components/SortableGrid/types'
import { Skeleton } from '@/ui/shadcn/components/skeleton'
import { GuidesGrid } from './GuidesGrid'

type Props = {
  category: GuideCategory
  guides: SortableItem<GuideDto>[]
  isLoading: boolean
  onDragEnd: (reorderedGuides: SortableItem<GuideDto>[]) => void
  onCreateGuide: (title: string) => void
  onRenameGuide: (guideDto: GuideDto, title: string) => void
  onDeleteGuide: (guideId: string) => void
}

export const GuidesPageView = ({
  category,
  guides,
  isLoading,
  onDragEnd,
  onCreateGuide,
  onRenameGuide,
  onDeleteGuide,
}: Props) => {
  const isLsp = category.value === 'lsp'
  const title = isLsp ? 'Guias LSP' : 'Guias MDX'
  const description = isLsp
    ? 'Gerencie os guias relacionados ao LSP (Language Server Protocol)'
    : 'Gerencie os guias relacionados ao MDX (Markdown XML)'

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold text-zinc-100'>{title}</h1>
        <p className='text-sm text-zinc-400'>{description}</p>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={String(index)} className='h-[80px] w-full rounded-xl' />
          ))}
        </div>
      ) : (
        <GuidesGrid
          key={guides.length}
          guides={guides}
          onDragEnd={onDragEnd}
          onCreateGuide={onCreateGuide}
          onRenameGuide={onRenameGuide}
          onDeleteGuide={onDeleteGuide}
        />
      )}
    </div>
  )
}
