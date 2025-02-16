import { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../../Dialog'

import { HOTKEYS } from './hotkeys'

type HotkeysDialogProps = {
  children: ReactNode
}

export function HotkeysDialog({ children }: HotkeysDialogProps) {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>Atalhos</DialogHeader>
        <dl className="mt-3 space-y-6">
          {HOTKEYS.map((hotkey) => (
            <div
              key={hotkey.action}
              className="grid grid-cols-[2fr_1fr] items-center"
            >
              <dt className="text-gray-400">{hotkey.action}</dt>
              <dd className="ml-3 text-gray-400">{hotkey.command}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
