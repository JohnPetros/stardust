'use client'
import { ReactNode } from 'react'
import * as T from '@radix-ui/react-tooltip'

interface RootProps {
  children: ReactNode
}

export function Tooltip({ children }: RootProps) {
  return <T.Root>{children}</T.Root>
}

export const Trigger = T.Trigger

interface TooltipProps {
  text: string
}

export function Content({ text }: TooltipProps) {
  return (
    <T.Portal>
      <T.Content
        className="max-w-sm bg-green-900 border border-gray-400 rounded-md p-2 shadow-md text-gray-100 text-sm"
        sideOffset={1}
        side='bottom'
      >
        {text}
        <T.TooltipArrow className="fill-gray-400" />
      </T.Content>
    </T.Portal>
  )
}
