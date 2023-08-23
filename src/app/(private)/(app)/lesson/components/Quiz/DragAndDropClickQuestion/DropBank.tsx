import { useDroppable } from '@dnd-kit/core'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface DropBankProps {
  id: number
  children: ReactNode
}

export function DropBank({ children, id }: DropBankProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `bank-${id}`,
    data: { type: 'bank' },
  })

  return (
    <li
      ref={setNodeRef}
      className={twMerge(
        'border-2 border-dashed border-gray-100 bg-transparent rounded-md w-24 h-12 text-gray-100',
        isOver ? 'bg-red-700' : ''
      )}
    >
      {children}
    </li>
  )
}
