'use client'
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { Check, Prohibit, X } from '@phosphor-icons/react'
import * as Container from '@radix-ui/react-toast'
import { AnimatePresence, motion, useAnimate, Variants } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
const TOAST_DURATION = 2500

type Type = 'error' | 'success'

interface openProps {
  type: Type
  message: string
}

export interface ToastRef {
  open: ({ type, message }: openProps) => void
}

export const ToastComponent = (_: unknown, ref: ForwardedRef<ToastRef>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<Type>('error')
  const [message, setMessage] = useState('')
  const [scope, animate] = useAnimate()

  const toastVariants: Variants = {
    initial: {
      opacity: 0,
      x: 250,
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        duration: 0.4,
      },
    },
    close: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  const barVariants: Variants = {
    full: {
      width: '100%',
    },
    empty: {
      width: 0,
      transition: {
        ease: 'linear',
        duration: TOAST_DURATION / 1000,
      },
    },
  }

  function open({ type, message }: openProps) {
    setType(type)
    setMessage(message)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })

  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      close()
    }, TOAST_DURATION)

    return () => clearTimeout(timer)
  }, [isOpen])

  return (
    <>
      <Container.Viewport className="fixed right-4 top-4 z-50  flex max-w-[90vw] rounded" />
      <AnimatePresence>
        {isOpen && (
          <Container.Root type="foreground" forceMount open={isOpen} asChild>
            <motion.div
              ref={scope}
              variants={toastVariants}
              initial="initial"
              animate="open"
              exit="close"
              drag="x"
              dragConstraints={{
                left: 0,
                right: 10,
              }}
              dragElastic={0.8}
              onDragEnd={() => {
                animate(scope.current, { x: 500 }, { duration: 0.1 })
                close()
              }}
              className={twMerge(
                'rounded',
                type === 'error' ? 'bg-red-800' : 'bg-green-600'
              )}
            >
              <div className="flex justify-between gap-6 p-4 ">
                <Container.Description className="flex items-center gap-2 text-gray-100">
                  <span
                    className={twMerge(
                      'rounded p-1 text-gray-100',
                      type === 'error' ? 'bg-red-700' : 'bg-green-500'
                    )}
                  >
                    {type === 'error' ? (
                      <Prohibit width={20} height={20} weight="bold" />
                    ) : (
                      <Check width={20} height={20} weight="bold" />
                    )}
                  </span>
                  <span
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                </Container.Description>

                <Container.Close
                  className="w-max"
                  asChild
                  aria-label="Fechar mensagem"
                >
                  <button onClick={close}>
                    <X
                      className="text-gray-400"
                      width={20}
                      height={20}
                      weight="bold"
                    />
                  </button>
                </Container.Close>
              </div>

              <motion.div
                variants={barVariants}
                initial="full"
                animate="empty"
                className="w-full rounded"
              >
                <div
                  className={twMerge(
                    'h-1',
                    type === 'error' ? 'bg-red-700' : 'bg-green-500'
                  )}
                />
              </motion.div>
            </motion.div>
          </Container.Root>
        )}
      </AnimatePresence>
    </>
  )
}

export const Toast = forwardRef(ToastComponent)
