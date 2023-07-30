'use client'
import { Icon } from '@phosphor-icons/react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipRef,
} from '@/app/components/Tooltip'
import { useRef } from 'react'

interface InfoProps {
  label: string | number
  icon: Icon
  tooltipText: string
}

export function Info({ label, icon: Icon, tooltipText }: InfoProps) {
  const tooltipRef = useRef<TooltipRef>(null)

  return (
    <li className="text-sm text-gray-400">
      <Tooltip>
        <TooltipTrigger
          className="flex items-center gap-1"
          onMouseOver={() => tooltipRef.current?.show()}
          onMouseLeave={() => tooltipRef.current?.hide()}
        >
          <Icon className="text-gray-400 text-sm" weight="bold" />
          {label}
        </TooltipTrigger>
        <TooltipContent ref={tooltipRef} text={tooltipText} />
      </Tooltip>
    </li>
  )
}
