import type { ReactNode } from 'react'

import * as Dialog from '../../Dialog'

import { buildHotkeys } from './hotkeys'

type HotkeysDialogProps = {
  children: ReactNode
  isMacOS: boolean
}

export function HotkeysDialog({ children, isMacOS }: HotkeysDialogProps) {
  const hotkeys = buildHotkeys({
    primaryModifierKeyLabel: isMacOS ? 'Cmd' : 'Ctrl',
    altModifierKeyLabel: isMacOS ? 'Option' : 'Alt',
  })

  return (
    <Dialog.Container>
      <Dialog.Content>
        <Dialog.Header>Atalhos</Dialog.Header>
        <dl className='mt-3 space-y-6'>
          {hotkeys.map((hotkey) => (
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
