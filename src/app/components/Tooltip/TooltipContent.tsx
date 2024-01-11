'use client'
import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import * as T from '@radix-ui/react-tooltip'
import { AnimatePresence, motion, Variants } from 'framer-motion'

import { useTooltip } from './useTooltip'

const contentAnimations: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

export type TooltipRef = {
  show: VoidFunction
  hide: VoidFunction
}

type TooltipContentProps = {
  text: string
  direction?: 'top' | 'left' | 'right' | 'bottom'
}

const TooltipComponent = (
  { text, direction = 'bottom' }: TooltipContentProps,
  ref: ForwardedRef<TooltipRef>
) => {
  const { hide, show, isVisible } = useTooltip()

  useImperativeHandle(
    ref,
    () => {
      return {
        show,
        hide,
      }
    },
    [show, hide]
  )

  return (
    <T.Portal>
      <AnimatePresence>
        {isVisible && (
          <T.Content
            className="z-50 max-w-sm"
            sideOffset={1}
            side={direction}
            forceMount
          >
            <motion.p
              variants={contentAnimations}
              initial="hidden"
              animate="visible"
              className="rounded-md border border-gray-400 bg-green-900 p-2 text-center text-sm text-gray-100 shadow-md"
            >
              {text}
              <T.TooltipArrow className="fill-gray-400" />
            </motion.p>
          </T.Content>
        )}
      </AnimatePresence>
    </T.Portal>
  )
}

export const TooltipContent = forwardRef(TooltipComponent)
