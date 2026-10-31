import type { PropsWithChildren } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/shadcn/components/tooltip'

type Props = {
  content: string
}

export const TooltipView = ({ children, content }: PropsWithChildren<Props>) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className='bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm text-zinc-50'>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}
