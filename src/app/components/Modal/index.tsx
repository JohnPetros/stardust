'use client'
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import Lottie from 'lottie-react'

import { motion, Variants } from 'framer-motion'

import { playSound } from '@/utils/functions'
import { MODAL_EFFECTS } from '@/utils/constants'
import { Dialog, DialogTitle } from '../Dialog'

export type ModalType = 'earning' | 'crying' | 'denying' | 'asking' | 'generic'

const modalAnimations: Variants = {
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
  type: ModalType
  canPlaySong?: boolean
  title: string
  body: ReactNode
  footer: ReactNode
}

const ModalComponent = (
  { type, canPlaySong = true, title, body, footer }: ModalProps,
  ref: ForwardedRef<ModalRef>
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
  }, [isOpen])

  return (
    <Dialog isOpen={isOpen} onClose={close}>
      <div className="flex items-center border-b border-gray-700 pb-2">
        <DialogTitle className="mx-auto font-semibold text-white text-center flex items-center justify-center">
          {title}
        </DialogTitle>
      </div>
      <div className="flex justify-center mt-3">
        <Lottie animationData={animation} style={{ width: 200 }} loop={true} />
      </div>

      {body}
      {footer}
    </Dialog>
  )
}

export const Modal = forwardRef(ModalComponent)
