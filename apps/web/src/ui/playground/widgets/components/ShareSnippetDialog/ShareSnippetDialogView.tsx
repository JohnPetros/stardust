'use client'

import type { PropsWithChildren } from 'react'

import { Button } from '@/ui/global/widgets/components/Button'
import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Icon } from '@/ui/global/widgets/components/Icon'
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
        <Dialog.Title className='text-gray-100 text-center'>
          Compartilhar snippet
        </Dialog.Title>
        <div className='mb-2 flex justify-end'>
          <Dialog.Close asChild>
            <button type='button' aria-label='Fechar dialog'>
              <Icon name='close' size={20} className='text-gray-400' weight='bold' />
            </button>
          </Dialog.Close>
        </div>
        <Input
          type='text'
          label='Url desse snippet'
          icon='share'
          value={playgroundUrl}
          readOnly
        />
        <div className='mt-6'>
          <Dialog.Close asChild>
            <Button className='text-gray-900' onClick={onShareSnippet}>
              Copiar
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
    </Dialog.Container>
  )
}
