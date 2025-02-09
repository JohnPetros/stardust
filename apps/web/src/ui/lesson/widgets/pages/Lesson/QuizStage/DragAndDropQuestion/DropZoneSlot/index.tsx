'use client'

import { useDroppable } from '@dnd-kit/core'
import { twMerge } from 'tailwind-merge'

import type { DraggableItem } from '@stardust/core/lesson/structs'

import { Item } from '../Item'
import { getItemWidth } from '../getItemWidth'
import { useDropZoneSlot } from './useDropZoneSlot'

type DropZoneProps = {
  index: number
  item: DraggableItem | null
}

export function DropZoneSlot({ index, item }: DropZoneProps) {
  const { borderColor } = useDropZoneSlot()
  const { setNodeRef } = useDroppable({
    id: index,
    data: { type: 'slot', hasItem: Boolean(item) },
  })
  const width = item ? getItemWidth(item.label.value) : ''

  return (
    <div
      ref={setNodeRef}
      className={twMerge(
        'min-w-4 grid h-10 place-content-center rounded-md border border-gray-100 bg-green-900 text-blue-300',
        item ? 'px-0' : 'px-6',
        borderColor,
      )}
    >
      {item && (
        <Item
          index={item.index.value}
          label={item.label.value}
          originalDropZoneIndex={item.originalDropZoneIndex.value}
          isInSlot={true}
          isActive={false}
          width={width}
        />
      )}
    </div>
  )
}
