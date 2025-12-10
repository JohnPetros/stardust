import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { SortableItem } from '../types'
import { useState } from 'react'

export function useSortableContainer<ItemValue>(
  initialItems: SortableItem<ItemValue>[],
  onDragEnd: (
    newItems: SortableItem<ItemValue>[],
    originItemId: string,
    targetItemId: string,
  ) => void,
) {
  const [items, setItems] = useState(initialItems)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    if (active.id !== over?.id) {
      const originItemId = active.id.toString()
      const targetItemId = over.id.toString()

      const oldIndex = items.findIndex((item) => item.id === originItemId)
      const newIndex = items.findIndex((item) => item.id === targetItemId)
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)
      onDragEnd(newItems, originItemId, targetItemId)
    }
  }

  return { items, handleDragEnd }
}
