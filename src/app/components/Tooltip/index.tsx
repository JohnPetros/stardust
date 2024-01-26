'use client'
import { ReactNode } from 'react'
import {
  Content,
  Portal,
  Root,
  TooltipArrow,
  Trigger,
} from '@radix-ui/react-tooltip'
import { AnimatePresence, motion, Variants } from 'framer-motion'

import { useTooltip } from '../Tooltip/useTooltip'

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

type TooltipProps = {
  direction: 'top' | 'right' | 'bottom' | 'left' | undefined
  children: ReactNode
  content: string
}

export function Tooltip({
  children: trigger,
  content,
  direction,
}: TooltipProps) {
  const { hide, show, isVisible } = useTooltip()

  return (
    <Root>
      <Portal>
        <AnimatePresence>
          {isVisible && content && (
            <Content
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
                {content}
                <TooltipArrow className="fill-gray-400" />
              </motion.p>
            </Content>
          )}
        </AnimatePresence>
      </Portal>
      <Trigger
        className="cursor-pointer"
        onMouseOver={show}
        onMouseLeave={hide}
        asChild
      >
        {trigger}
      </Trigger>
    </Root>
  )
}
