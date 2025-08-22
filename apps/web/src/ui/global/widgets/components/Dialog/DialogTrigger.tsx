import type { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { DialogTrigger as Trigger } from '@radix-ui/react-dialog'

type Props = {
  className?: string
}

export function DialogTrigger({ children, className }: PropsWithChildren<Props>) {
  return (
    <Trigger asChild className={twMerge('w-full', className)}>
      {children}
    </Trigger>
  )
}
