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
      className={twMerge('bg-green-400', className)}
    >
      <Icon name='plus' size={14} className='text-green-900' />
      {children}
    </button>
  )
}
