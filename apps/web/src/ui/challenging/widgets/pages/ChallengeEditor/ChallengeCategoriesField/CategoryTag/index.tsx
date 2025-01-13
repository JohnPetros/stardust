import { Icon } from '@/ui/global/widgets/components/Icon'
import type { PropsWithChildren } from 'react'

import { twMerge } from 'tailwind-merge'

type CategoryTagProps = {
  isActive: boolean
  onClick: VoidFunction
}

export function CategoryTag({
  isActive,
  children,
  onClick,
}: PropsWithChildren<CategoryTagProps>) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={twMerge(
        'flex items-center gap-1 rounded-md text-gray-900 font-medium p-2',
        isActive ? 'bg-green-400' : 'bg-gray-400',
      )}
    >
      {children}
      <div
        className={twMerge(
          'grid place-content-center rounded-full size-3',
          isActive ? 'bg-green-900' : 'bg-gray-700',
        )}
      >
        <Icon
          name={isActive ? 'close' : 'plus'}
          size={10}
          className={isActive ? 'text-green-400' : 'text-gray-400'}
        />
      </div>
    </button>
  )
}
