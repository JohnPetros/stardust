import type { ReactNode } from 'react'
import { type ClassNameValue, twMerge } from 'tailwind-merge'
import { DialogClose as Close } from '@radix-ui/react-dialog'

import { Button } from '../Button'

type DialogCloseProps = {
  children: ReactNode
  asChild?: boolean
  className?: ClassNameValue
}

export function DialogClose({ children, asChild = false, className }: DialogCloseProps) {
  return (
    <Close asChild>
      <Button className={twMerge('w-full bg-gray-600 text-gray-200', className)}>
        {children}
      </Button>
    </Close>
  )
}
