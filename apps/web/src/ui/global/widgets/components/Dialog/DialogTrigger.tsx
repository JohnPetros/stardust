import type { ReactNode } from 'react'
import { DialogTrigger as Trigger } from '@radix-ui/react-dialog'

type DialogTriggerProps = {
  children: ReactNode
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  return (
    <Trigger asChild className='w-full'>
      {children as JSX.Element}
    </Trigger>
  )
}
