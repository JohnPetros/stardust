'use client'

import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { Check, Prohibit } from '@phosphor-icons/react'
import * as Container from '@radix-ui/react-toast'
import { twMerge } from 'tailwind-merge'
import { AnimatePresence, motion, Variants } from 'framer-motion'

import type { ToastRef } from '../types'

import { useToast } from './useToast'
import { Icon } from '../../../widgets/components/Icon'

const toastAnimations: Variants = {
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

export const ToastComponent = (_: unknown, ref: ForwardedRef<ToastRef>) => {
  const { type, message, seconds, isOpen, scope, open, close, handleDragEnd } = useToast()

  const barAnimations: Variants = {
    full: {
      width: '100%',
    },
    empty: {
      width: 0,
      transition: {
        ease: 'linear',
        duration: seconds,
      },
    },
  }

  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Container.Root type='foreground' forceMount asChild>
            <motion.div
              ref={scope}
              variants={toastAnimations}
              initial='initial'
              animate='open'
              exit='close'
              drag='x'
              tabIndex={-1}
              dragConstraints={{
                left: 0,
                right: 10,
              }}
              dragElastic={0.8}
              onDragEnd={handleDragEnd}
              className={twMerge(
                'fixed right-8 top-4 z-[1500] cursor-grab rounded',
                type === 'error' ? 'bg-red-800' : 'bg-green-900',
              )}
            >
              <div className='flex justify-between gap-6 p-4 '>
                <Container.Description className='flex items-center gap-2 text-gray-100'>
                  <span
                    className={twMerge(
                      'rounded p-1 text-gray-100',
                      type === 'error' ? 'bg-red-700' : 'bg-green-500',
                    )}
                  >
                    {type === 'error' ? (
                      <Icon name='stop-sign' size={18} weight='bold' />
                    ) : (
                      <Check width={18} size={18} weight='bold' />
                    )}
                  </span>
                  <span
                    className='text-sm'
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                </Container.Description>

                <Container.Close className='w-max' asChild aria-label='Fechar mensagem'>
                  <button type='button' onClick={close}>
                    <Icon
                      name='close'
                      className='text-gray-400'
                      size={20}
                      weight='bold'
                    />
                  </button>
                </Container.Close>
              </div>

              <motion.div
                variants={barAnimations}
                initial='full'
                animate='empty'
                className='w-full rounded'
              >
                <div
                  className={twMerge(
                    'h-1',
                    type === 'error' ? 'bg-red-700' : 'bg-green-500',
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
