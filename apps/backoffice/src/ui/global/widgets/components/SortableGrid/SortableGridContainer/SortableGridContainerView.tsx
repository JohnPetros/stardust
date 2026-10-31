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
  rectSortingStrategy,
} from '@dnd-kit/sortable'

import { useSortableGridContainer } from './useSortableGridContainer'
import type { SortableItem } from '../types'

type Props<ItemValue> = {
  items: SortableItem<ItemValue>[]
  children: (items: SortableItem<ItemValue>[]) => ReactNode
  onDragEnd: (
    newItems: SortableItem<ItemValue>[],
    originItemId: string,
    targetItemId: string,
  ) => void
}

export const SortableGridContainerView = <ItemValue,>({
  items: initialItems,
  children,
  onDragEnd,
}: Props<ItemValue>) => {
  const { items, handleDragEnd } = useSortableGridContainer(initialItems, onDragEnd)
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
        items={items.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        {items.length > 0 ? children(items) : null}
      </SortableContext>
    </DndContext>
  )
}
