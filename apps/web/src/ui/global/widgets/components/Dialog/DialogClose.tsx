import type { ReactNode } from 'react'
import { type ClassNameValue, twMerge } from 'tailwind-merge'
import { DialogClose as Close } from '@radix-ui/react-dialog'

type DialogCloseProps = {
  children: ReactNode
  asChild?: boolean
  className?: ClassNameValue
}

export function DialogClose({ children, asChild = false, className }: DialogCloseProps) {
  return (
    <Close asChild>
      <button type='button' className={twMerge(className)}>
        {children}
      </button>
    </Close>
  )
}
