'use client'

import { ReactNode, useRef } from 'react'
import { Icon } from '@phosphor-icons/react'
import { motion, Variants } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import {
  Tooltip,
  TooltipContent,
  TooltipRef,
  TooltipTrigger,
} from '@/app/components/Tooltip'

interface SidenavButtonProps {
  icon: Icon
  title: string
  isExpanded: boolean
  isActive: boolean
  counterBadge?: ReactNode
  onClick: VoidFunction
}

const titleVariants: Variants = {
  shrink: {
    width: 0,
  },
  expand: {
    width: 'auto',
    paddingLeft: '8px',
    transition: {
      delay: 0.05,
    },
  },
}

export function SidenavButton({
  icon: Icon,
  title,
  isExpanded,
  isActive,
  counterBadge,
  onClick,
}: SidenavButtonProps) {
  const tooltipRef = useRef<TooltipRef>(null)

  return (
    <Tooltip>
      <TooltipTrigger tooltipRef={tooltipRef}>
        <button
          onClick={onClick}
          className={twMerge(
            'relative flex h-auto w-max items-center justify-center rounded-md bg-transparent p-3 text-sm text-gray-100 outline-green-500 transition-colors duration-200 hover:bg-green-700/30',
            isActive ? 'bg-green-500/30' : ''
          )}
        >
          <Icon className="text-lg text-green-400" />
          <motion.span
            variants={titleVariants}
            initial="shrink"
            animate={isExpanded ? 'expand' : ''}
            className="block overflow-hidden"
          >
            {title}
          </motion.span>

          {!isExpanded && (
            <TooltipContent ref={tooltipRef} text={title} direction="right" />
          )}

          {counterBadge && counterBadge}
        </button>
      </TooltipTrigger>
    </Tooltip>
  )
}
