'use client'

import { List } from '@phosphor-icons/react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import { useMemo } from 'react'

const itemStyles = tv({
  base: 'rounded-md flex items-center justify-between bg-purple-700 border-2 p-3 w-full mx-auto custom-outline text-medium cursor-grab',
  variants: {
    color: {
      gray: 'border-gray-100 text-gray-100',
      red: 'border-red-700 text-red-700',
      green: 'border-green-500 text-green-500',
      blue: 'border-blue-300 text-blue-300',
      transparent: 'opacity-0',
    },
  },
})

interface SortableItemProps {
  id: number
  label: string
  isActive: boolean
  isOverlay?: boolean
  isAnswerCorrect: boolean
  isAnswerVerified: boolean
}

export function SortableItem({
  id,
  label,
  isActive,
  isAnswerCorrect,
  isAnswerVerified,
}: SortableItemProps) {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const color = useMemo(() => {
    if (isDragging) {
      return 'transparent'
    } else if (isActive) {
      return 'blue'
    } else if (isAnswerVerified && isAnswerCorrect) {
      return 'green'
    } else if (isAnswerVerified && !isAnswerCorrect) {
      return 'red'
    } else {
      return 'gray'
    }
  }, [isDragging, isActive, isAnswerVerified, isAnswerCorrect])

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={itemStyles({ color })}
    >
      <strong>{label}</strong>
      <List
        className={twMerge(
          'text-lg',
          isActive ? 'text-blue-300' : 'text-gray-100',
          isAnswerVerified && isAnswerCorrect
            ? 'text-green-500'
            : isAnswerVerified
            ? 'text-red-700'
            : ''
        )}
      />
    </div>
  )
}
