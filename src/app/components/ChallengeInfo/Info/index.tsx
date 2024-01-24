'use client'

import { Icon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { Tooltip } from '../../@Tooltip'

interface InfoProps {
  label: string | number
  icon: Icon
  iconStyle?: string
  tooltipText: string
}

export function Info({ label, icon: Icon, iconStyle, tooltipText }: InfoProps) {
  return (
    <li className="text-sm text-gray-400">
      <Tooltip content={tooltipText} direction="bottom">
        <div className="flex items-center gap-1">
          <Icon
            className={twMerge('text-sm text-gray-400', iconStyle)}
            weight="bold"
          />
          {label}
        </div>
      </Tooltip>
    </li>
  )
}
