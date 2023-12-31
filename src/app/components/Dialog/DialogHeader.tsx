'use client'

import { X } from '@phosphor-icons/react'
import { DialogClose, DialogTitle } from '@radix-ui/react-dialog'

interface DialogHeaderProps {
  children: string
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <header className="flex justify-between border-b p-3">
      <DialogTitle className="mx-auto flex w-full items-center justify-between text-xl font-semibold text-white">
        {children}
        <DialogClose className="p-2">
          <X className="text-xl" weight="bold" />
        </DialogClose>
      </DialogTitle>
    </header>
  )
}
