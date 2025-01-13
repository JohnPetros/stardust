import type { PropsWithChildren } from 'react'

import { twMerge, type ClassNameValue } from 'tailwind-merge'

import { Icon } from '@/ui/global/widgets/components/Icon'

type AddItemButtonProps = {
  className?: ClassNameValue
  onClick: VoidFunction
}

export function AddItemButton({
  className,
  children,
  onClick,
}: PropsWithChildren<AddItemButtonProps>) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={twMerge(
        'flex items-center gap-1 text-green-400 text-sm bg-transparent',
        className,
      )}
    >
      <Icon name='plus' size={16} className='text-green-400' />
      {children}
    </button>
  )
}
