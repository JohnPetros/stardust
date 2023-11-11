import { ReactNode } from 'react'
import { X } from '@phosphor-icons/react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/Dialog'
import { SHORTCUTS } from '@/utils/constants'

interface ShortCutsProps {
  children: ReactNode
}

export function Shortcuts({ children }: ShortCutsProps) {
  return (
    <Dialog>
      <DialogContent>
        <header className="flex justify-between border-b p-3">
          <DialogTitle className="mx-auto flex w-full items-center justify-between text-xl font-semibold text-white">
            Atalhos
            <DialogClose className="p-2">
              <X className="text-xl" weight="bold" />
            </DialogClose>
          </DialogTitle>
        </header>
        <dl className="mt-3 space-y-6">
          {SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.action}
              className="grid grid-cols-[2fr_1fr] items-center"
            >
              <dt className="text-gray-400">{shortcut.action}</dt>
              <dd className="ml-3 text-gray-400">{shortcut.command}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
      <DialogTrigger asChild>{children}</DialogTrigger>
    </Dialog>
  )
}
