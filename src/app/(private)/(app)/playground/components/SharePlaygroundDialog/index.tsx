'use client'

import { ReactNode } from 'react'
import { ShareNetwork } from '@phosphor-icons/react'

import { useSharePlaygroundDialog } from './useSharePlaygroundDialog'

import { Button } from '@/global/components/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/global/components/Dialog'
import { Input } from '@/global/components/Input'
import { ROUTES } from '@/global/constants'
import { getAppBaseUrl } from '@/global/helpers'

type SharePlaygroundDialogProps = {
  children: ReactNode
  playgroundId: string
}

export function SharePlaygroundDialog({
  children: trigger,
  playgroundId,
}: SharePlaygroundDialogProps) {
  const playgroundUrl = `${getAppBaseUrl()}${
    ROUTES.private.playground
  }/${playgroundId}`

  const { handleSharePlayground } = useSharePlaygroundDialog(playgroundUrl)

  return (
    <Dialog>
      <DialogContent>
        <Input
          type="text"
          label="Url desse playground"
          icon={ShareNetwork}
          value={playgroundUrl}
          readOnly
        />
        <div className="mt-6 grid grid-cols-2 items-center gap-2">
          <DialogClose asChild>
            <Button className="text-gray-900" onClick={handleSharePlayground}>
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
