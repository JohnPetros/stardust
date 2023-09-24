import { useDroppable } from '@dnd-kit/core'
import { ReactNode } from 'react'
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
          'border-2 border-dashed border-gray-100 bg-transparent rounded-md h-10 w-full text-gray-100'
      )}
    >
      {hasDroppedItem ? children : null}
    </li>
  )
}
