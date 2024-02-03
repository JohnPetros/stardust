'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { List } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { useSortableItem } from './useSortableItem'

const itemStyles = tv({
  base: 'rounded-md flex items-center justify-between bg-purple-700 border-2 p-3 w-full mx-auto custom-outline cursor-grab',
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

export type SortableItemProps = {
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
  const { color, marginLeft } = useSortableItem({
    label,
    isActive,
    isAnswerCorrect,
    isAnswerVerified,
    isDragging,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={itemStyles({ color })}
    >
      <span style={{ marginLeft }} className={twMerge('block')}>
        {label}
      </span>
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
