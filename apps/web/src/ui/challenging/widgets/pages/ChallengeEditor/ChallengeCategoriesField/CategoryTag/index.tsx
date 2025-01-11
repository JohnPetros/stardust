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
      className={twMerge('rounded-md', isActive ? 'bg-green-400' : 'bg-gray-400')}
    >
      <div
        className={twMerge(
          'grid place-content-center rounded-full p-[1px]',
          isActive ? 'bg-green-900' : 'bg-gray-500',
        )}
      >
        <Icon
          name='close'
          size={10}
          className={isActive ? 'text-green-400' : 'text-gray-700'}
        />
      </div>
      {children}
    </button>
  )
}
