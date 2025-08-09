import { useEffect, useState } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

export function useSortableContainer(
  itemCount: number,
  onDragEnd: (originItemIndex: number, targetItemIndex: number) => void,
) {
  const [items, setItems] = useState(
    Array.from({ length: itemCount }, (_, index) => index),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    if (active.id !== over?.id) {
      const originItem = Number(active.id)
      const targetItem = Number(over.id)

      setItems((items) => {
        const oldIndex = items.indexOf(originItem)
        const newIndex = items.indexOf(targetItem)
        return arrayMove(items, oldIndex, newIndex)
      })
      onDragEnd(originItem, targetItem)
    }
  }

  return { items, handleDragEnd }
}
