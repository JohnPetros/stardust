'use client'

import type { Ref } from 'react'
import * as Container from '@radix-ui/react-toast'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { twMerge } from 'tailwind-merge'

import type { ToastType } from '../types'
import { Icon } from '../../../widgets/components/Icon'

type Props = {
  type: ToastType
  message: string
  seconds: number
  animationKey: number
  isOpen: boolean
  scope: Ref<HTMLDivElement>
  onClose: () => void
  onDragEnd: () => void
}

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

export const ToastView = ({
  type,
  message,
  seconds,
  animationKey,
  isOpen,
  scope,
  onClose,
  onDragEnd,
}: Props) => {
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

  return (
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
            dragConstraints={{ left: 0, right: 10 }}
            dragElastic={0.8}
            onDragEnd={onDragEnd}
            className='fixed right-8 top-4 z-[1500] w-[min(360px,90vw)] cursor-grab overflow-hidden rounded-theme border border-theme-border-quiet bg-theme-surface'
          >
            <div className='flex items-center justify-between gap-6 p-4'>
              <Container.Description className='flex min-w-0 flex-1 items-center gap-2 text-theme-text-primary'>
                <span
                  className={twMerge(
                    'flex size-6 shrink-0 place-content-center items-center rounded-theme',
                    type === 'error'
                      ? 'bg-theme-danger-surface text-theme-danger'
                      : 'bg-theme-success-surface text-theme-success',
                  )}
                >
                  <Icon
                    name={type === 'error' ? 'stop-sign' : 'check'}
                    size={16}
                    weight='bold'
                  />
                </span>
                <span
                  className='text-sm font-normal'
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              </Container.Description>

              <Container.Close className='w-max' asChild aria-label='Fechar mensagem'>
                <button
                  type='button'
                  onClick={onClose}
                  className='shrink-0 rounded-theme text-theme-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-action'
                >
                  <Icon name='close' size={20} weight='bold' />
                </button>
              </Container.Close>
            </div>

            <motion.div
              key={animationKey}
              data-testid='toast-progress-bar'
              variants={barAnimations}
              initial='full'
              animate='empty'
              className='w-full'
            >
              <div
                className={twMerge(
                  'h-1',
                  type === 'error' ? 'bg-theme-danger' : 'bg-theme-success',
                )}
              />
            </motion.div>
          </motion.div>
        </Container.Root>
      )}
    </AnimatePresence>
  )
}
