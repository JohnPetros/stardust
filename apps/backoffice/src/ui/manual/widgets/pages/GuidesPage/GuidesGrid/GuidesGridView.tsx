import type { GuideDto } from '@stardust/core/manual/entities/dtos'

import type { SortableItem } from '@/ui/global/widgets/components/SortableGrid/types'
import { SortableGrid } from '@/ui/global/widgets/components/SortableGrid'
import { GuideCard } from './GuideCard'
import { CreateGuideCard } from './CreateGuideCard'

type Props = {
  guides: SortableItem<GuideDto>[]
  onDragEnd: (reorderedGuides: SortableItem<GuideDto>[]) => void
  onCreateGuide: (title: string) => void
  onRenameGuide: (guideDto: GuideDto, title: string) => void
  onDeleteGuide: (guideId: string) => void
}

export const GuidesGridView = ({
  guides,
  onDragEnd,
  onCreateGuide,
  onRenameGuide,
  onDeleteGuide,
}: Props) => {
  return (
    <SortableGrid.Container items={guides} onDragEnd={onDragEnd}>
      {(items) => (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {items.map((item) => (
            <SortableGrid.Item key={item.id} id={item.id} iconSize={32}>
              <GuideCard
                guide={item.data}
                onRename={(title) => onRenameGuide(item.data, title)}
                onDelete={() => onDeleteGuide(item.id)}
              />
            </SortableGrid.Item>
          ))}
          <CreateGuideCard onCreate={onCreateGuide} />
        </div>
      )}
    </SortableGrid.Container>
  )
}
