import type { ReactNode } from 'react'
import * as Container from '@radix-ui/react-dialog'
import { type ClassNameValue, twMerge } from 'tailwind-merge'

import { DialogAnimationView } from './DialogAnimationView'

type DialogProps = {
  children: ReactNode
  className?: ClassNameValue
  animationClassName?: ClassNameValue
}

export function DialogContent({ children, className, animationClassName }: DialogProps) {
  return (
    <Container.Portal>
      <Container.Content
        aria-describedby={undefined}
        className={twMerge(
          'fixed left-1/2 top-1/2 z-[500] max-h-screen w-full max-w-[calc(512px+3rem)] -translate-x-1/2 -translate-y-1/2 p-6',
          className,
        )}
      >
        <DialogAnimationView className={animationClassName}>
          {children}
        </DialogAnimationView>
      </Container.Content>
    </Container.Portal>
  )
}
