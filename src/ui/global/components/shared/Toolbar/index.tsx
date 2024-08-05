import { ReactNode } from 'react'
import { Root } from '@radix-ui/react-toolbar'
import { ClassNameValue, twMerge } from 'tailwind-merge'

type ToolbarProps = {
  children: ReactNode
  className?: ClassNameValue
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <Root className={twMerge('flex items-center gap-2', className)}>
      {children}
    </Root>
  )
}
