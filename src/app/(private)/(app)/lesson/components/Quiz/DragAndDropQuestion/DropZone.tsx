'use client'

import { MutableRefObject, useEffect, useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { twMerge } from 'tailwind-merge'

import { DragItem } from './DragItem'
import { getDragItemWidth } from '.'

import { DraggrableItem } from '@/@types/quiz'
import { useLessonStore } from '@/stores/lessonStore'

interface DropZoneProps {
  id: string
  droppedItem: DraggrableItem | null
  activeDraggableItemId: number | null
  userDragItemsIdsSenquence: MutableRefObject<number[]>
}

export function DropZone({
  id,
  droppedItem,
  activeDraggableItemId,
  userDragItemsIdsSenquence,
}: DropZoneProps) {
  const { isAnswerVerified, isAnswerCorrect } = useLessonStore(
    (store) => store.state
  )

  const { setNodeRef } = useDroppable({
    id,
    data: { type: 'zone', hasDroppedItem: !!droppedItem },
  })

  useEffect(() => {
    if (!activeDraggableItemId && droppedItem) {
      userDragItemsIdsSenquence.current.push(droppedItem.id)
    }
  }, [activeDraggableItemId])

  const borderColor = useMemo(() => {
    if (isAnswerVerified && isAnswerCorrect) {
      return 'border-green-500'
    } else if (isAnswerVerified) {
      return 'border-red-700'
    } else {
      return 'border-gray-100'
    }
  }, [isAnswerVerified, isAnswerCorrect])

  const width = droppedItem ? getDragItemWidth(droppedItem) : ''

  return (
    <div
      ref={setNodeRef}
      className={twMerge(
        'min-w-4 grid h-10 place-content-center rounded-md border border-gray-100 bg-green-900 text-blue-300',
        droppedItem ? 'px-0' : 'px-6',
        borderColor
      )}
    >
      {droppedItem && (
        <DragItem
          id={droppedItem.id}
          label={droppedItem.label}
          isDroppedInZone={true}
          isActive={false}
          width={width}
        />
      )}
    </div>
  )
}
