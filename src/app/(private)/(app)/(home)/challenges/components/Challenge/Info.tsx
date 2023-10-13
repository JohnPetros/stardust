'use client'
import { Icon } from '@phosphor-icons/react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipRef,
} from '@/app/components/Tooltip'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'

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
          
        >
          <Icon className={twMerge("text-gray-400 text-sm", iconStyle)} weight="bold" />
          {label}
        </TooltipTrigger>
        <TooltipContent ref={tooltipRef} text={tooltipText} />
      </Tooltip>
    </li>
  )
}
