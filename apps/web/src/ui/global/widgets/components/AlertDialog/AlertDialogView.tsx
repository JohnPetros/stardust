'use client'

import type { ReactNode, RefObject } from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

import type { AlertDialogType } from './types'
import type { AnimationName } from '../Animation/types'
import { Animation as DialogAnimation } from '../Dialog'
import { Hydration } from '../Hydration'
import { Animation } from '../Animation'

export type AlertDialogProps = {
  type: AlertDialogType
  title: string
  body: ReactNode
  action: ReactNode
  cancel?: ReactNode
  children?: ReactNode
  shouldPlayAudio?: boolean
  shouldForceMount?: boolean
  shouldCloseOnInteractOutside?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export type AlertDialogViewProps = Omit<
  AlertDialogProps,
  'onOpenChange' | 'shouldPlayAudio'
> & {
  animation: AnimationName | null
  isRendered: boolean
  isOpen: boolean
  containerRef: RefObject<HTMLElement | null>
  onOpenChange: (isOpen: boolean) => void
}

export const AlertDialogView = ({
  title,
  body,
  action,
  cancel,
  children: trigger,
  animation,
  isRendered,
  isOpen,
  containerRef,
  shouldForceMount = false,
  shouldCloseOnInteractOutside = false,
  onOpenChange,
}: AlertDialogViewProps) => {
  return (
    <Hydration>
      <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialog.Portal container={isRendered ? containerRef.current : null}>
          <AlertDialog.Overlay
            className='fixed inset-0 z-[1000] overflow-y-auto bg-black bg-opacity-50'
            onClick={shouldCloseOnInteractOutside ? () => onOpenChange(false) : undefined}
          />
          <AlertDialog.Content
            forceMount={shouldForceMount ? true : undefined}
            className='fixed left-1/2 top-1/2 z-[1100] max-h-screen w-full max-w-[calc(512px+3rem)] -translate-x-1/2 -translate-y-1/2 p-6'
          >
            <DialogAnimation>
              <div className='flex items-center border-b border-theme-border-quiet pb-2'>
                <AlertDialog.Title className='mx-auto flex items-center justify-center text-center text-base font-semibold text-theme-text-primary'>
                  {title}
                </AlertDialog.Title>
              </div>

              <div className='mt-4 flex justify-center'>
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
        <AlertDialog.Trigger asChild>{trigger as null}</AlertDialog.Trigger>
      </AlertDialog.Root>
    </Hydration>
  )
}
