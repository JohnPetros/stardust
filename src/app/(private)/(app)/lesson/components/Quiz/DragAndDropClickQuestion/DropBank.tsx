import { useDroppable } from '@dnd-kit/core'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface DropBankProps {
  id: string
  children: ReactNode
  dropItemId: string
}

export function DropBank({ children, id, dropItemId }: DropBankProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'bank' },
  })

  const hasDroppedItem = dropItemId === id

  return (
    <li
      ref={setNodeRef}
      className={twMerge(
        !hasDroppedItem &&
          'border-2 border-dashed border-gray-100 bg-transparent rounded-md w-24 h-12 text-gray-100'
      )}
    >
      {dropItemId === id ? children : null}
    </li>
  )
}
