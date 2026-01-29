'use client'

import type { ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { DialogClose, DialogTitle } from '@radix-ui/react-dialog'
import { twMerge } from 'tailwind-merge'

interface DialogHeaderProps {
  children: ReactNode
  className?: string
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <header className={twMerge('flex justify-between border-b pb-3', className)}>
      <DialogTitle className='mx-auto flex w-full items-center justify-between text-lg font-semibold text-white'>
        <div className='flex items-center gap-2'>{children}</div>
        <DialogClose className='translate-x-2 p-2'>
          <X className='text-xl' weight='bold' />
        </DialogClose>
      </DialogTitle>
    </header>
  )
}
