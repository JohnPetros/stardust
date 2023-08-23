'use client'

import { DraggrableItem } from '@/types/quiz'
import { useDroppable } from '@dnd-kit/core'
import { DragItem } from '../DragItem'
import { twMerge } from 'tailwind-merge'

interface DropZoneProps {
  id: string
  droppedItem: DraggrableItem | null
  activeDraggableItemId: number | null
}

export function DropZone({
  id,
  droppedItem,
  activeDraggableItemId,
}: DropZoneProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: { type: 'dropZone' },
  })

  return (
    <div
      ref={setNodeRef}
      className={twMerge(
        'grid place-content-center rounded-md border border-gray-100 h-12 bg-green-900 min-w-4 text-blue-300',
        droppedItem ? 'px-0' : 'px-6'
      )}
    >
      {droppedItem && ( 
        <DragItem
          id={droppedItem.id}
          label={droppedItem.label}
          isAnswerCorrect={false}
          isAnswerVerified={false}
          isDropped={false}
          isActive={droppedItem.id === activeDraggableItemId}
        />
      )}
    </div>
  )
}
