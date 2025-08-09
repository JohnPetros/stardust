import type { ReactNode } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { cn } from '@/ui/shadcn/utils'

type Props = {
  id: string
  children: ReactNode
  className?: string
  iconSize?: number
}

export const SortableItemView = ({ id, children, className, iconSize = 24 }: Props) => {
  const { attributes, listeners, transform, transition, setNodeRef } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className='relative'>
      <div>{children}</div>
      <button
        {...attributes}
        {...listeners}
        className={cn(
          'cursor-grab active:cursor-grabbing absolute top-1/2 -translate-y-1/2 z-10',
          className,
        )}
      >
        <Icon name='draggable' className='text-zinc-500' size={iconSize} />
      </button>
    </div>
  )
}
