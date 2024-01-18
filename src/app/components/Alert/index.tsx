'use client'

import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle } from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import Lottie from 'lottie-react'

import { DialogAnimation } from '../Dialog'
import { Hydration } from '../Hydration'

import { useAlert } from './useAlert'

export type AlertType = 'earning' | 'crying' | 'denying' | 'asking' | 'generic'

export type AlertRef = {
  open: VoidFunction
  close: VoidFunction
}

type AlertProps = {
  type: AlertType
  title: string
  body: ReactNode
  action: ReactNode
  cancel?: ReactNode
  children?: ReactNode
  canPlaySong?: boolean
  canForceMount?: boolean
  onOpen?: VoidFunction
}

const AlertComponent = (
  {
    type,
    title,
    body,
    action,
    cancel,
    children,
    canPlaySong = true,
    canForceMount = false,
    onOpen,
  }: AlertProps,
  ref: ForwardedRef<AlertRef>
) => {
  const {
    animation,
    isRendered,
    isOpen,
    containerRef,
    setIsOpen,
    open,
    close,
  } = useAlert(type, canPlaySong, onOpen)

  useImperativeHandle(
    ref,
    () => {
      return {
        open,
        close,
      }
    },
    [open, close]
  )

  return (
    <Hydration>
      <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Portal
          container={isRendered ? containerRef.current : null}
        >
          <AlertDialog.Overlay className="fixed inset-0 z-[300] overflow-y-auto bg-black bg-opacity-50" />
          <AlertDialog.Content
            forceMount={canForceMount ? true : undefined}
            className="fixed left-1/2 top-1/2 z-[350] max-h-screen w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6"
          >
            <DialogAnimation>
              <div className="flex items-center border-b border-gray-700 pb-2">
                <AlertDialog.Title className="mx-auto flex items-center justify-center text-center font-semibold text-white">
                  {title}
                </AlertDialog.Title>
              </div>
              <div className="mt-3 flex justify-center">
                <Lottie
                  animationData={animation}
                  style={{ width: 200 }}
                  loop={true}
                />
              </div>

              {body}
              <div className="mt-4 flex justify-center gap-2">
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
        <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
      </AlertDialog.Root>
    </Hydration>
  )
}

export const Alert = forwardRef(AlertComponent)
