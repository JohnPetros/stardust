'use client'

import { useLesson } from '@/hooks/useLesson'
import { useDraggable } from '@dnd-kit/core'

import { CSS } from '@dnd-kit/utilities'
import { twMerge } from 'tailwind-merge'

interface DragItemProps {
  id: number
  label: string
  isActive: boolean
  isDroppedInZone?: boolean
}

export function DragItem({
  id,
  label,
  isActive,
  isDroppedInZone = false,
}: DragItemProps) {
  const {
    state: { isAnswerVerified, isAnswerCorrect },
  } = useLesson()

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
  }

  if (isDragging && !isDroppedInZone) {
    return (
      <li className="border-2 border-dashed border-gray-100 bg-transparent rounded-md w-24 h-12 text-gray-100"></li>
    )
  }

  return (
    <div
      ref={setDraggableNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={twMerge(
        'grid place-content-center border border-gray-10 text-gray-100 bg-purple-700 rounded-md w-24 h-12 cursor-grab',
        !isActive && isDroppedInZone ? 'border-none p-0 bg-transparent' : '',
        isActive ? 'text-blue-300 border-2 border-blue-300 cursor-grab' : '',
        isAnswerVerified && isAnswerCorrect && isDroppedInZone
          ? 'text-green-400'
          : isAnswerVerified && isDroppedInZone && 'text-red-700'
      )}
    >
      {label}
    </div>
  )
}
