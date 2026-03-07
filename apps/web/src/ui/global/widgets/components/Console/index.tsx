'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { createPortal } from 'react-dom'

import type { ConsoleRef } from './types'
import { useConsole } from './useConsole'
import { ConsoleView } from './ConsoleView'

export type Props = {
  outputs: string[]
  height: number
  shouldRenderInPortal?: boolean
}

export const ConsoleWidget = (
  { outputs, height, shouldRenderInPortal = false }: Props,
  ref: ForwardedRef<ConsoleRef>,
) => {
  const { isOpen, panelHeight, open, close, handlePanelDragDown } = useConsole(height)

  useImperativeHandle(ref, () => {
    return {
      open,
      close,
    }
  }, [open, close])

  const content = (
    <ConsoleView
      outputs={outputs}
      isOpen={isOpen}
      panelHeight={panelHeight}
      onDragDown={handlePanelDragDown}
      onClose={close}
      positionMode={shouldRenderInPortal ? 'fixed' : 'absolute'}
    />
  )

  if (shouldRenderInPortal) {
    return createPortal(content, document.body)
  }

  return content
}

export const Console = forwardRef(ConsoleWidget)
