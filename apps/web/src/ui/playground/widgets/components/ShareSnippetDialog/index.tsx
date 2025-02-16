'use client'

import type { PropsWithChildren } from 'react'

import { ENV, ROUTES } from '@/constants'
import { Button } from '@/ui/global/widgets/components/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/ui/global/widgets/components/Dialog'
import { Input } from '@/ui/global/widgets/components/Input'

import { useShareSnippetDialog } from './useShareSnippetDialog'

type ShareSnippetDialogProps = {
  snippetId: string
}

export function ShareSnippetDialog({
  children: trigger,
  snippetId,
}: PropsWithChildren<ShareSnippetDialogProps>) {
  const playgroundUrl = `${ENV.appHost}${ROUTES.playground.snippet(snippetId)}`
  const { handleShareSnippet } = useShareSnippetDialog(playgroundUrl)

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
            <Button className='text-gray-900' onClick={handleShareSnippet}>
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
