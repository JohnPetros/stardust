'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { twMerge } from 'tailwind-merge'

import { useLessonStore } from '@/stores/lessonStore'

interface DragItemProps {
  id: number
  label: string
  isActive: boolean
  isDroppedInZone?: boolean
  width: string
}

export function DragItem({
  id,
  label,
  isActive,
  isDroppedInZone = false,
  width,
}: DragItemProps) {
  const { isAnswerVerified, isAnswerCorrect } = useLessonStore(
    (store) => store.state
  )
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    data: { bankId: `bank-${id}`, isInZone: isDroppedInZone },
    disabled: isAnswerVerified,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    width,
  }

  if (isDragging && !isDroppedInZone) {
    return (
      <div
        style={{ width: style.width }}
        className="h-10 rounded-md border-2 border-dashed border-gray-100 bg-transparent text-gray-100"
      ></div>
    )
  }

  return (
    <div
      ref={setDraggableNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={twMerge(
        'border-gray-10 flex h-10 w-full cursor-grab items-center justify-center rounded-md border bg-purple-700 p-1 font-code text-gray-100',
        !isActive && isDroppedInZone ? 'border-none bg-transparent p-0' : '',
        isActive ? 'cursor-grab border-2 border-blue-300 text-blue-300' : '',
        isAnswerVerified && isAnswerCorrect && isDroppedInZone
          ? 'text-green-400'
          : isAnswerVerified && isDroppedInZone && 'text-red-700'
      )}
    >
      {label}
    </div>
  )
}
