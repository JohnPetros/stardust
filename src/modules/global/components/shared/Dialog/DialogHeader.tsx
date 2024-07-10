'use client'

import { X } from '@phosphor-icons/react'
import { DialogClose, DialogTitle } from '@radix-ui/react-dialog'

interface DialogHeaderProps {
  children: string
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <header className='flex justify-between border-b pb-3'>
      <DialogTitle className='mx-auto flex w-full items-center justify-between text-lg font-semibold text-white'>
        {children}
        <DialogClose className='translate-x-2 p-2'>
          <X className='text-xl' weight='bold' />
        </DialogClose>
      </DialogTitle>
    </header>
  )
}
