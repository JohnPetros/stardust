import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { SortableItem } from '../types'

export function useSortableContainer<ItemValue>(
  items: SortableItem<ItemValue>[],
  onDragEnd: (
    newItems: SortableItem<ItemValue>[],
    originItemIndex: number,
    targetItemIndex: number,
  ) => void,
) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    if (active.id !== over?.id) {
      const originItemIndex = Number(active.id)
      const targetItemIndex = Number(over.id)

      const oldIndex = items.findIndex((item) => item.index === originItemIndex)
      const newIndex = items.findIndex((item) => item.index === targetItemIndex)
      const newItems = arrayMove(items, oldIndex, newIndex)
      onDragEnd(newItems, originItemIndex, targetItemIndex)
    }
  }

  return { items, handleDragEnd }
}
