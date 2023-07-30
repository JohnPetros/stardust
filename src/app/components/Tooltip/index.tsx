'use client'
import { ReactNode, forwardRef, useImperativeHandle, useState } from 'react'
import * as T from '@radix-ui/react-tooltip'
import { Variants, motion, AnimatePresence } from 'framer-motion'

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

interface RootProps {
  children: ReactNode
}

export function Tooltip({ children }: RootProps) {
  return <T.Root>{children}</T.Root>
}

export const TooltipTrigger = T.Trigger

interface TooltipProps {
  text: string
}

export interface TooltipRef {
  show: VoidFunction
  hide: VoidFunction
}

export const TooltipContent = forwardRef<TooltipRef, TooltipProps>(
  ({ text }: TooltipProps, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    function show() {
      setIsVisible(true)
    }

    function hide() {
      setIsVisible(false)
    }

    useImperativeHandle(
      ref,
      () => {
        return {
          show,
          hide,
        }
      },
      []
    )

    return (
      <T.Portal>
        <AnimatePresence>
          {isVisible && (
            <T.Content
              className="max-w-sm "
              sideOffset={1}
              side="bottom"
              forceMount
            >
              <motion.p
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="bg-green-900 border border-gray-400 rounded-md p-2 shadow-md text-gray-100 text-sm"
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
)
