'use client'

import type { PropsWithChildren } from 'react'

import { Button } from '@/ui/global/widgets/components/Button'
import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Input } from '@/ui/global/widgets/components/Input'

type Props = {
  playgroundUrl: string
  onShareSnippet: () => void
}

export const ShareSnippetDialogView = ({
  children: trigger,
  playgroundUrl,
  onShareSnippet,
}: PropsWithChildren<Props>) => {
  return (
    <Dialog.Container>
      <Dialog.Content>
        <Input
          type='text'
          label='Url desse snippet'
          icon='share'
          value={playgroundUrl}
          readOnly
        />
        <div className='mt-6 grid grid-cols-2 items-center gap-2'>
          <Dialog.Close asChild>
            <Button className='text-gray-900' onClick={onShareSnippet}>
              Copiar
            </Button>
          </Dialog.Close>
          <Dialog.Close>Cancelar</Dialog.Close>
        </div>
      </Dialog.Content>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
    </Dialog.Container>
  )
}
