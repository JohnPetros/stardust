import { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/app/components/Dialog'
import { HOTKEYS } from '@/utils/constants'

interface ShortCutsProps {
  children: ReactNode
}

export function Shortcuts({ children }: ShortCutsProps) {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>Atalhos</DialogHeader>
        <dl className="mt-3 space-y-6">
          {HOTKEYS.map((shortcut) => (
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
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
