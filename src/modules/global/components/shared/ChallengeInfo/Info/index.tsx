'use client'

import { twMerge } from 'tailwind-merge'

import type { IconName } from '../../Icon/types'
import { Tooltip } from '../../Tooltip'
import { Icon } from '../../Icon'

type InfoProps = {
  label: string | number
  icon: IconName
  iconStyle?: string
  tooltipText: string
}

export function Info({ label, icon, iconStyle, tooltipText }: InfoProps) {
  return (
    <li className='text-sm text-gray-400'>
      <Tooltip content={tooltipText} direction='bottom'>
        <div className='flex items-center gap-1'>
          <Icon
            name={icon}
            weight='bold'
            className={twMerge('text-sm text-gray-400', iconStyle)}
          />
          {label}
        </div>
      </Tooltip>
    </li>
  )
}
