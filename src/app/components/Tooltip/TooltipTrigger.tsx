import { ReactNode, RefObject } from 'react'
import { Trigger } from '@radix-ui/react-tooltip'

import { TooltipRef } from './TooltipContent'

type TooltipTriggerProps = {
  children: ReactNode
  tooltipRef: RefObject<TooltipRef>
  className?: string
}

export function TooltipTrigger({
  children,
  tooltipRef,
  className,
}: TooltipTriggerProps) {
  return (
    <Trigger
      className={className}
      onMouseOver={() => tooltipRef.current?.show()}
      onMouseLeave={() => tooltipRef.current?.hide()}
    >
      {children}
    </Trigger>
  )
}
