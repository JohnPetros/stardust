import type { ReactNode } from 'react'

import * as Dialog from '../../Dialog'

import { HOTKEYS } from './hotkeys'

type HotkeysDialogProps = {
  children: ReactNode
}

export function HotkeysDialog({ children }: HotkeysDialogProps) {
  return (
    <Dialog.Container>
      <Dialog.Content>
        <Dialog.Header>Atalhos</Dialog.Header>
        <dl className='mt-3 space-y-6'>
          {HOTKEYS.map((hotkey) => (
            <div key={hotkey.action} className='grid grid-cols-[2fr_1fr] items-center'>
              <dt className='text-gray-400'>{hotkey.action}</dt>
              <dd className='ml-3 text-gray-400'>{hotkey.command}</dd>
            </div>
          ))}
        </dl>
      </Dialog.Content>
      <Dialog.Trigger>{children}</Dialog.Trigger>
    </Dialog.Container>
  )
}
