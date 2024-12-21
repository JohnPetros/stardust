'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { List } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { useItem } from './useItem'
import { StyledLabel } from './StyledLabel'

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

export type ItemProps = {
  id: number
  label: string
  isActive: boolean
  isOverlay?: boolean
}

export function Item({ id, label, isActive }: ItemProps) {
  const { isDragging, attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const { iconColor, labelBackground, marginLeft } = useItem({
    label,
    isActive,
    isDragging,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <StyledLabel background={labelBackground} iconColor={iconColor}>
        <span style={{ marginLeft }} className={twMerge('block')}>
          {label}
        </span>
      </StyledLabel>
    </div>
  )
}
