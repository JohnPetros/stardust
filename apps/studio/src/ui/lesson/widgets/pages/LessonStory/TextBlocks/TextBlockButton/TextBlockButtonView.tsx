import type { PropsWithChildren, ReactNode } from 'react'
import { Button } from '@/ui/shadcn/components/button'

type Props = {
  endContent: ReactNode
}

export const TextBlockButtonView = ({
  children,
  endContent,
}: PropsWithChildren<Props>) => {
  return (
    <Button
      variant='secondary'
      className='flex items-center justify-between w-full bg-zinc-800 shadow-sm text-zinc-300 py-8'
    >
      {children}
      {endContent}
    </Button>
  )
}
