'use client'

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipRef,
} from '@/app/components/Tooltip'

import { Icon } from '@phosphor-icons/react'
import { Variants, motion } from 'framer-motion'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface SidenavButtonProps {
  icon: Icon
  title: string
  isExpanded: boolean
  isActive: boolean
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
  onClick,
}: SidenavButtonProps) {
  const tooltipRef = useRef<TooltipRef>(null)

  return (
    <Tooltip>
      <TooltipTrigger
        asChild
        onMouseOver={() => tooltipRef.current?.show()}
        onMouseLeave={() => tooltipRef.current?.hide()}
      >
        <button
          onClick={onClick}
          className={twMerge(
            'bg-transparent flex items-center justify-center text-gray-100 text-sm p-3 h-auto w-max hover:bg-green-700/30 transition-colors duration-200 rounded-md relative outline-green-500',
            isActive ? 'bg-green-500/30' : ''
          )}
        >
          <Icon className="text-green-400 text-lg" />
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
        </button>
      </TooltipTrigger>
    </Tooltip>
  )
}
