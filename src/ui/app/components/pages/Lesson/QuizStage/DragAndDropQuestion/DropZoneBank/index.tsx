import type { ReactNode } from 'react'

import { useDroppable } from '@dnd-kit/core'
import { twMerge } from 'tailwind-merge'

type DropZoneBankProps = {
  index: number
  children: ReactNode
  hasItem: boolean
  width: string
}

export function DropZoneBank({ children, index, hasItem, width }: DropZoneBankProps) {
  const { setNodeRef } = useDroppable({
    id: index,
    data: { type: 'bank' },
  })

  return (
    <li
      ref={setNodeRef}
      style={{ width }}
      className={twMerge(
        !hasItem &&
          'h-10 w-full rounded-md border-2 border-dashed border-gray-100 bg-transparent text-gray-100',
      )}
    >
      {hasItem ? children : null}
    </li>
  )
}
