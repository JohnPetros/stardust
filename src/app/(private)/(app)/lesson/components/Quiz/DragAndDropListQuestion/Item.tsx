'use client'

import { List } from '@phosphor-icons/react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { twMerge } from 'tailwind-merge'

interface ItemProps {
  id: number
  label: string
  isActive: boolean
  isOverlay?: boolean
}

export function Item({ id, label, isActive }: ItemProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={twMerge(
        'rounded-md flex items-center justify-between bg-purple-700 border-2 p-3 w-full max-w-sm mx-auto borde text-medium',
        isActive
          ? 'border-blue-300 text-blue-300'
          : 'border-gray-100 text-gray-100',
        isDragging && 'opacity-0'
      )}
    >
      <strong>{label}</strong>
      <List
        className={twMerge(
          'text-lg',
          isActive ? 'text-blue-300' : 'text-gray-100'
        )}
      />
    </div>
  )
}
