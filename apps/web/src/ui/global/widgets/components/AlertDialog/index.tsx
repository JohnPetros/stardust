'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import type { AlertDialogRef } from './types'
import { useAlertDialog } from './useAlertDialog'
import { AlertDialogView, type AlertDialogProps } from './AlertDialogView'

const AlertDialogComponent = (
  { type, shouldPlayAudio = true, onOpenChange, ...viewProps }: AlertDialogProps,
  ref: ForwardedRef<AlertDialogRef>,
) => {
  const { animation, isRendered, isOpen, containerRef, handleOpenChange, open, close } =
    useAlertDialog(type, shouldPlayAudio, onOpenChange)

  useImperativeHandle(ref, () => {
    return {
      open,
      close,
    }
  }, [open, close])

  return (
    <AlertDialogView
      {...viewProps}
      type={type}
      animation={animation}
      isRendered={isRendered}
      isOpen={isOpen}
      containerRef={containerRef}
      onOpenChange={handleOpenChange}
    />
  )
}

const Component = forwardRef(AlertDialogComponent)

export { Component as AlertDialog }
