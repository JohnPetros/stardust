import { Icon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

interface SorterButtonProps {
  title: string
  isActive: boolean
  icon: Icon
}

export function SorterButton({ title, isActive, icon: Icon }: SorterButtonProps) {
  return (
    <button
      className={twMerge(
        'text-sm p-2 hover:text-gray-100 hidden md:flex items-center gap-1 group',
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
