'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { twMerge } from 'tailwind-merge'

import { useItem } from './useItem'
import { StyledLabel } from './StyledLabel'

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
