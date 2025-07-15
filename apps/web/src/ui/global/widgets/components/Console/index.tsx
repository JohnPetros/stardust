'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import type { ConsoleRef } from './types'
import { useConsole } from './useConsole'
import { ConsoleView } from './ConsoleView'

export type Props = {
  outputs: string[]
  height: number
}

export const ConsoleWidget = (
  { outputs, height }: Props,
  ref: ForwardedRef<ConsoleRef>,
) => {
  const { isOpen, panelHeight, open, close, handlePanelDragDown } = useConsole(height)

  useImperativeHandle(ref, () => {
    return {
      open,
      close,
    }
  }, [open, close])

  return (
    <ConsoleView
      outputs={outputs}
      isOpen={isOpen}
      panelHeight={panelHeight}
      onDragDown={handlePanelDragDown}
      onClose={close}
    />
  )
}

export const Console = forwardRef(ConsoleWidget)
