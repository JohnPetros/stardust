import { ReactNode } from 'react'
import * as Container from '@radix-ui/react-dialog'

import { DialogAnimation } from './DialogAnimation'

interface DialogProps {
  children: ReactNode
}

export function DialogContent({ children }: DialogProps) {
  return (
    <Container.Portal>
      <Container.Content
        forceMount
        className="fixed left-1/2 top-1/2 z-50 max-h-screen w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6"
      >
        <DialogAnimation>{children}</DialogAnimation>
      </Container.Content>
    </Container.Portal>
  )
}
