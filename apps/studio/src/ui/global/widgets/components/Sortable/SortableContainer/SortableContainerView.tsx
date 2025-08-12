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
import type { SortableItem } from '../types'

type Props<ItemValue> = {
  items: SortableItem<ItemValue>[]
  children: (items: SortableItem<ItemValue>[]) => ReactNode
  onDragEnd: (
    newItems: SortableItem<ItemValue>[],
    originItemPosition: number,
    targetItemPosition: number,
  ) => void
}

export const SortableContainerView = <ItemValue,>({
  items: initialItems,
  children,
  onDragEnd,
}: Props<ItemValue>) => {
  const { items, handleDragEnd } = useSortableContainer(initialItems, onDragEnd)
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
        items={items.map((item) => item.index.toString())}
        strategy={verticalListSortingStrategy}
      >
        {children(items)}
      </SortableContext>
    </DndContext>
  )
}
