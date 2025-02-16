'use client'

import { type ForwardedRef, forwardRef, type ReactNode, useImperativeHandle } from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

import type { AlertDialogRef, AlertDialogType } from './types'
import { DialogAnimation } from '../Dialog'
import { Hydration } from '../Hydration'
import { Animation } from '../Animation'
import { useAlertDialog } from './useAlertDialog'

type AlertDialogProps = {
  type: AlertDialogType
  title: string
  body: ReactNode
  action: ReactNode
  cancel?: ReactNode
  children?: ReactNode
  shouldPlayAudio?: boolean
  shouldForceMount?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

const AlertDialogComponent = (
  {
    type,
    title,
    body,
    action,
    cancel,
    children: trigger,
    shouldPlayAudio = true,
    shouldForceMount = false,
    onOpenChange,
  }: AlertDialogProps,
  ref: ForwardedRef<AlertDialogRef>,
) => {
  const { animation, isRendered, isOpen, containerRef, handleOpenChange, open, close } =
    useAlertDialog(type, shouldPlayAudio, onOpenChange)

  useImperativeHandle(
    ref,
    () => {
      return {
        open,
        close,
      }
    },
    [open, close],
  )

  return (
    <Hydration>
      <AlertDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <AlertDialog.Portal container={isRendered ? containerRef.current : null}>
          <AlertDialog.Overlay className='fixed inset-0 z-[1000] overflow-y-auto bg-black bg-opacity-50' />
          <AlertDialog.Content
            forceMount={shouldForceMount ? true : undefined}
            className='fixed left-1/2 top-1/2 z-[1100] max-h-screen w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6'
          >
            <DialogAnimation>
              <div className='flex items-center border-b border-gray-700 pb-2'>
                <AlertDialog.Title className='mx-auto flex items-center justify-center text-center font-semibold text-white'>
                  {title}
                </AlertDialog.Title>
              </div>

              <div className='mt-3 flex justify-center'>
                {animation && <Animation name={animation} size={200} hasLoop={true} />}
              </div>

              {body}
              <div className='mt-4 flex justify-center gap-2'>
                <AlertDialog.AlertDialogAction asChild>
                  {action}
                </AlertDialog.AlertDialogAction>
                <AlertDialog.AlertDialogCancel asChild>
                  {cancel}
                </AlertDialog.AlertDialogCancel>
              </div>
            </DialogAnimation>
          </AlertDialog.Content>
        </AlertDialog.Portal>
        <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      </AlertDialog.Root>
    </Hydration>
  )
}

const Component = forwardRef(AlertDialogComponent)

export { Component as AlertDialog }
