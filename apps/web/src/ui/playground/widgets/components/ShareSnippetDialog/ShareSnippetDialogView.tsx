'use client'

import type { PropsWithChildren } from 'react'

import { Button } from '@/ui/global/widgets/components/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/ui/global/widgets/components/Dialog'
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
    <Dialog>
      <DialogContent>
        <Input
          type='text'
          label='Url desse snippet'
          icon='share'
          value={playgroundUrl}
          readOnly
        />
        <div className='mt-6 grid grid-cols-2 items-center gap-2'>
          <DialogClose asChild>
            <Button className='text-gray-900' onClick={onShareSnippet}>
              Copiar
            </Button>
          </DialogClose>
          <DialogClose>Cancelar</DialogClose>
        </div>
      </DialogContent>
      <DialogTrigger>{trigger}</DialogTrigger>
    </Dialog>
  )
}
