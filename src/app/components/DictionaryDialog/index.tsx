import { ReactNode } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../Dialog'

import { useDictionaryDialog } from './useDictionaryDialog'

type DictionaryDialogProps = {
  children: ReactNode
}

export function DictionaryDialog({ children }: DictionaryDialogProps) {
  const { isLoading, topics } = useDictionaryDialog()

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>Dicionário</DialogHeader>
      </DialogContent>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
