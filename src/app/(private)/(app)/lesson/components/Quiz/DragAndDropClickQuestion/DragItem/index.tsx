'use client'

import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { twMerge } from 'tailwind-merge'

interface DragItemProps {
  id: number
  label: string
  isAnswerVerified: boolean
  isAnswerCorrect: boolean
  isActive: boolean
  isDropped?: boolean
}

export function DragItem({
  id,
  label,
  isAnswerVerified,
  isAnswerCorrect,
  isActive,
  isDropped = false,
}: DragItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    data: { bankId: `bank-${id}` },
  })
  
  const style = {
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging && !isDropped) {
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
        'grid place-content-center border border-gray-100 bg-purple-700 text-gray-100 rounded-md w-24 h-12  cursor-grab',
        !isActive && isDropped ? 'border-none p-0 bg-transparent' : '',
        isActive ? 'text-blue-300 border-blue-300 border- cursor-grab' : ''
      )}
    >
      {label}
    </div>
  )
}
