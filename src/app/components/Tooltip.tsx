'use client'

import {
  ForwardedRef,
  forwardRef,
  ReactNode,
  RefObject,
  useImperativeHandle,
  useState,
} from 'react'
import * as T from '@radix-ui/react-tooltip'
import { AnimatePresence, motion, Variants } from 'framer-motion'

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

export interface TooltipRef {
  show: VoidFunction
  hide: VoidFunction
}

interface RootProps {
  children: ReactNode
}

interface TooltipTriggerProps {
  children: ReactNode
  tooltipRef: RefObject<TooltipRef>
  className?: string
}

export function Tooltip({ children }: RootProps) {
  return <T.Root>{children}</T.Root>
}

export function TooltipTrigger({
  children,
  tooltipRef,
  className,
}: TooltipTriggerProps) {
  return (
    <T.Trigger
      className={className}
      onMouseOver={() => tooltipRef.current?.show()}
      onMouseLeave={() => tooltipRef.current?.hide()}
    >
      {children}
    </T.Trigger>
  )
}

interface TooltipProps {
  text: string
  direction?: 'top' | 'left' | 'right' | 'bottom'
}

const TooltipComponent = (
  { text, direction = 'bottom' }: TooltipProps,
  ref: ForwardedRef<TooltipRef>
) => {
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
            className="z-50 max-w-sm"
            sideOffset={1}
            side={direction}
            forceMount
          >
            <motion.p
              variants={contentVariants}
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
