import { Icon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

interface SorterButtonProps {
  title: string
  isActive: boolean
  icon: Icon
}

export function SorterButton({
  title,
  isActive,
  icon: Icon,
}: SorterButtonProps) {
  return (
    <button
      className={twMerge(
        'group hidden items-center gap-1 p-2 text-sm hover:text-gray-100 md:flex',
        isActive ? 'text-gray-100' : 'text-gray-400'
      )}
    >
      <Icon
        className={twMerge(
          'group-hover:text-gray-100',
          isActive ? 'text-gray-100' : 'text-gray-400'
        )}
      />
      {title}
    </button>
  )
}
