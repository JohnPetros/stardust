'use client'

import type { ReactNode } from 'react'
import { X } from '@phosphor-icons/react/dist/ssr'
import { DialogClose, DialogTitle } from '@radix-ui/react-dialog'
import { twMerge } from 'tailwind-merge'

type DialogHeaderProps = {
  children: ReactNode
  className?: string
}

export function DialogHeaderView({ children, className }: DialogHeaderProps) {
  return (
    <header
      className={twMerge(
        'flex items-center justify-between gap-2 border-b border-theme-border-quiet pb-2',
        className,
      )}
    >
      <DialogTitle className='text-lg font-semibold text-theme-text-primary'>
        <div className='flex items-center gap-2'>{children}</div>
      </DialogTitle>
      <DialogClose
        aria-label='Fechar'
        className='flex size-11 shrink-0 items-center justify-center rounded-theme text-theme-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-action'
      >
        <X className='text-xl' weight='bold' />
      </DialogClose>
    </header>
  )
}
