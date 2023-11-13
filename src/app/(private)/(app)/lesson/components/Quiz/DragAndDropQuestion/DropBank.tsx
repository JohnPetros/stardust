import { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { twMerge } from 'tailwind-merge'

interface DropBankProps {
  id: string
  children: ReactNode
  dropItemId: string
  width: string
}

export function DropBank({ children, id, dropItemId, width }: DropBankProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: { type: 'bank' },
  })

  const hasDroppedItem = dropItemId === id

  return (
    <li
      ref={setNodeRef}
      style={{ width }}
      className={twMerge(
        !hasDroppedItem &&
          'h-10 w-full rounded-md border-2 border-dashed border-gray-100 bg-transparent text-gray-100'
      )}
    >
      {hasDroppedItem ? children : null}
    </li>
  )
}
