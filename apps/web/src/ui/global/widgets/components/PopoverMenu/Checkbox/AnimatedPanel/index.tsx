'use client'

import type { ReactNode } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { AnimatePresence, motion, type Variants } from 'framer-motion'

const variants: Variants = {
  up: {
    opacity: 0,
    y: -24,
    x: 24,
  },
  down: {
    opacity: 1,
    y: 0,
    x: 0,
  },
}

type AnimatedPanelProps = {
  children: ReactNode
  isOpen: boolean
}

export function AnimatedPanel({ children, isOpen }: AnimatedPanelProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <Popover.Portal forceMount>
          <div className='flex flex-col'>
            <Popover.Content className='z-[2000] mr-1 min-w-[6rem]' sideOffset={5}>
              <motion.div
                variants={variants}
                initial='up'
                animate='down'
                exit='up'
                transition={{ duration: 0.2 }}
                className='h-full w-full rounded-md bg-gray-700 p-2'
              >
                <Popover.Arrow className='fill-gray-700' />

                {children}
              </motion.div>
            </Popover.Content>
          </div>
        </Popover.Portal>
      ) : null}
    </AnimatePresence>
  )
}
