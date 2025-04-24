import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import { DropZone } from '@stardust/core/lesson/structures'

type UseDndProps = {
  onDragStart: (itemIndex: number) => void
  onDragEnd: (itemIndex: number, dropZone: DropZone) => void
  onDragCancel: VoidFunction
}

export function useDnd({ onDragStart, onDragEnd, onDragCancel }: UseDndProps) {
  function handleDragStart(event: DragStartEvent) {
    onDragStart(Number(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    console.log(active, over)

    if (!over) return

    const dropZone = DropZone.create({
      index: Number(over.id),
      type: String(over.data.current?.type),
      hasItem: Boolean(over.data.current?.hasItem),
    })

    onDragEnd(Number(active.id), dropZone)
  }

  function handleDragCancel() {
    onDragCancel()
  }

  return {
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
