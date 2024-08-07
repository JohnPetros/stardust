'use client'

import { useLessonStore } from '@/ui/app/stores/LessonStore'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { twMerge } from 'tailwind-merge'
import { useItem } from './useItem'

type ItemProps = {
  index: number
  originalDropZoneIndex: number
  label: string
  isActive: boolean
  width: string
  isInSlot?: boolean
}

export function Item({
  index,
  originalDropZoneIndex,
  label,
  isActive,
  isInSlot = false,
}: ItemProps) {
  const { getQuizSlice } = useLessonStore()
  const { quiz } = getQuizSlice()
  const { width, textColor, border } = useItem(label, isActive, isInSlot)

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: index,
    data: { originalDropZoneIndex, isInSlot: isInSlot },
    disabled: quiz?.userAnswer.isVerified.isTrue,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    width,
  }

  if (isDragging && !isInSlot) {
    return (
      <div
        style={{ width: style.width }}
        className='h-10 rounded-md border-2 border-dashed border-gray-100 bg-transparent text-gray-100'
      />
    )
  }

  return (
    <div
      ref={setDraggableNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={twMerge(
        'flex h-10 w-full cursor-grab items-center justify-center rounded-md bg-purple-700 font-code',
        border,
        textColor,
      )}
    >
      {label}
    </div>
  )
}
