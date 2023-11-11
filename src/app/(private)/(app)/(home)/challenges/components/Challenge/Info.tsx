'use client'
import { useRef } from 'react'
import { Icon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import {
  Tooltip,
  TooltipContent,
  TooltipRef,
  TooltipTrigger,
} from '@/app/components/Tooltip'

interface InfoProps {
  label: string | number
  icon: Icon
  iconStyle?: string
  tooltipText: string
}

export function Info({ label, icon: Icon, iconStyle, tooltipText }: InfoProps) {
  const tooltipRef = useRef<TooltipRef>(null)

  return (
    <li className="text-sm text-gray-400">
      <Tooltip>
        <TooltipTrigger
          className="flex items-center gap-1"
          tooltipRef={tooltipRef}
        >
          <Icon
            className={twMerge('text-sm text-gray-400', iconStyle)}
            weight="bold"
          />
          {label}
        </TooltipTrigger>
        <TooltipContent ref={tooltipRef} text={tooltipText} />
      </Tooltip>
    </li>
  )
}
