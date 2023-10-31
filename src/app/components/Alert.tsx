'use client'

import {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import Lottie from 'lottie-react'

import { DialogAnimation } from './Dialog'

import { MODAL_EFFECTS } from '@/utils/constants'
import { playSound } from '@/utils/functions'

export type AlertType = 'earning' | 'crying' | 'denying' | 'asking' | 'generic'

export interface AlertRef {
  open: VoidFunction
  close: VoidFunction
}

interface ModalProps {
  type: AlertType
  canPlaySong?: boolean
  title: string
  body: ReactNode
  action: ReactNode
  cancel?: ReactNode
  children?: ReactNode
}

const AlertComponent = (
  {
    type,
    canPlaySong = true,
    title,
    body,
    action,
    cancel,
    children,
  }: ModalProps,
  ref: ForwardedRef<AlertRef>
) => {
  const [isOpen, setIsOpen] = useState(false)

  const { animation, sound } = MODAL_EFFECTS.find(
    (animation) => animation.id === type.toLocaleLowerCase()
  )!

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        open,
        close,
      }
    },
    []
  )

  useEffect(() => {
    if (sound && isOpen && type !== 'generic' && canPlaySong) {
      playSound(sound)
    }
  }, [isOpen, canPlaySong, type, sound])

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-screen w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6">
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
            <div className="mt-3 flex items-center justify-center gap-2">
              <AlertDialog.Action asChild>{action}</AlertDialog.Action>
              <AlertDialog.Cancel asChild>{cancel}</AlertDialog.Cancel>
            </div>
          </DialogAnimation>
        </AlertDialog.Content>
      </AlertDialog.Portal>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
    </AlertDialog.Root>
  )
}

export const Alert = forwardRef(AlertComponent)
