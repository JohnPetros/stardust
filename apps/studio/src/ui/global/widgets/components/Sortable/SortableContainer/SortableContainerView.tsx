import type { ReactNode } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { useSortableContainer } from './useSortableContainer'

type Props = {
  itemCount: number
  children: (items: number[]) => ReactNode
  onDragEnd: (originItemIndex: number, targetItemIndex: number) => void
}

export const SortableContainerView = ({ itemCount, children, onDragEnd }: Props) => {
  const { items, handleDragEnd } = useSortableContainer(itemCount, onDragEnd)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.toString())}
        strategy={verticalListSortingStrategy}
      >
        {children(items)}
      </SortableContext>
    </DndContext>
  )
}
