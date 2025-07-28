import type { PropsWithChildren } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/shadcn/components/tooltip'

type Props = {
  content: string
}

export const TooltipView = ({ children, content }: PropsWithChildren<Props>) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}
