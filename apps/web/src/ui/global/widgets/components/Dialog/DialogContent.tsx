import type { ReactNode } from 'react'
import * as Container from '@radix-ui/react-dialog'
import { type ClassNameValue, twMerge } from 'tailwind-merge'

import { DialogAnimation } from './DialogAnimation'

type DialogProps = {
  children: ReactNode
  className?: ClassNameValue
}

export function DialogContent({ children, className }: DialogProps) {
  return (
    <Container.Portal>
      <Container.Content
        forceMount
        className={twMerge(
          'fixed left-1/2 top-1/2 z-[500] max-h-screen w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6',
          className
        )}
      >
        <DialogAnimation>{children}</DialogAnimation>
      </Container.Content>
    </Container.Portal>
  )
}
