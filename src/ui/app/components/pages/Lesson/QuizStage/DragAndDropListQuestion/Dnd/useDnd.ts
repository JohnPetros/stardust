import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

type UseDndProps = {
  onDragStart: (itemIndex: number) => void
  onDragEnd: (fromPosition: number, toPosition: number) => void
  onDragCancel: VoidFunction
}

export function useDnd({ onDragStart, onDragEnd, onDragCancel }: UseDndProps) {
  function handleDragStart(event: DragStartEvent) {
    onDragStart(Number(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      onDragEnd(Number(active.id), Number(over.id))
    }
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
