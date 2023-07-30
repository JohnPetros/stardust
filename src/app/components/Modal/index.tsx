'use client'
import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import Lottie from 'lottie-react'

import { motion, Variants } from 'framer-motion'

import { X } from '@phosphor-icons/react'
import { MODAL_EFFECTS } from '@/utils/constants'
import { playSound } from '@/utils/functions'

export type Type = 'earning' | 'crying' | 'denying' | 'asking' | 'generic'

const modalVariants: Variants = {
  close: {
    opacity: 0,
    scale: 0.8,
  },
  open: {
    opacity: 1,
    scale: 1,
  },
}

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

export const Container = Dialog.Root

export const Modal = forwardRef<ModalRef, ModalProps>(
  ({ type, canPlaySong = true, title, body, footer }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    if (!type) return null

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
    }, [isOpen])

    return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 z-50">
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-screen w-full max-w-lg p-6">
              <motion.div
                variants={modalVariants}
                initial="close"
                animate="open"
                className="rounded-lg bg-gray-800 p-6 border border-gray-700"
              >
                <div className="flex items-start border-b border-gray-700 pb-2">
                  <Dialog.Title className="font-semibold text-white text-center flex items-center justify-center">
                    {title}
                  </Dialog.Title>
                  <Dialog.Close
                    onClick={close}
                    className="p-2 hover:bg-gray-700 transition-colors duration-200 rounded-full"
                  >
                    <X className="text-gray-500" weight="bold" />
                  </Dialog.Close>
                </div>
                <div className="flex justify-center mt-3">
                  <Lottie
                    animationData={animation}
                    style={{ width: 200 }}
                    loop={true}
                  />
                </div>

                {body}
                {footer}
              </motion.div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
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
