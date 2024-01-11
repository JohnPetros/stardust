import { ReactNode } from 'react'
import { Root } from '@radix-ui/react-tooltip'

type TooltipProps = {
  children: ReactNode
}

export function TooltipRoot({ children }: TooltipProps) {
  return <Root>{children}</Root>
}
