'use client'
import { ReactNode, forwardRef, useImperativeHandle, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from '@phosphor-icons/react'
import { MODAL_EFFECTS } from '@/utils/constants'
import Lottie from 'lottie-react'

export type Type = 'earning' | 'crying' | 'denying' | 'asking' | 'generic'

export interface ModalRef {
  open: VoidFunction
  close: VoidFunction
}

interface ModalProps {
  type: Type
  canPlaySong?: boolean
  title: string
  body: ReactNode
  footer: ReactNode
}

export const Modal = forwardRef<ModalRef, ModalProps>(
  ({ type, canPlaySong = true, title, body, footer }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    if (!type) return null

    const { animation } = MODAL_EFFECTS.find(
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

    return (
      <Dialog.Root open={isOpen}>
        <Dialog.Overlay className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 z-50">
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto max-h-screen w-[90%] max-w-md p-6 rounded-lg bg-gray-800">
            <div className="flex items-start">
              <Dialog.Title className="font-semibold text-white text-center mx-auto">
                {title}
              </Dialog.Title>
              <Dialog.Close
                onClick={close}
                className="p-2 hover:bg-gray-700 transition-colors duration-200 rounded-full"
              >
                <X className="text-gray-500" weight="bold" />
              </Dialog.Close>
            </div>
            <div className="flex justify-center">
              <Lottie
                animationData={animation}
                style={{ width: 200 }}
                loop={true}
              />
            </div>

            {body}
            {footer}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Root>
    )
  }
)
// import { Trigger, Title, Close } from '@radix-ui/react-dialog'
// import { Content } from "./Content";

// export const Modal = {
//   Content,
//   Trigger,
//   Title,
//   Close
// }
