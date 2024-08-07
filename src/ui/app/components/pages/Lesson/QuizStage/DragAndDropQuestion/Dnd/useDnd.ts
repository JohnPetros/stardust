import { DropZone } from '@/@core/domain/structs'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

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

    if (!over) return

    const dropZone = DropZone.create(
      Number(over.id),
      String(over.data.current?.type),
      Boolean(over.data.current?.hasItem),
    )

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
