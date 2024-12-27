'use client'

import { twMerge } from 'tailwind-merge'

import type { IconName } from '../../../../../global/widgets/components/Icon/types'
import { Tooltip } from '../../../../../global/widgets/components/Tooltip'
import { Icon } from '../../../../../global/widgets/components/Icon'

type InfoProps = {
  label: string | number
  icon: IconName
  iconStyle?: string
  tooltipText: string
}

export function Info({ label, icon, iconStyle, tooltipText }: InfoProps) {
  return (
    <div className='text-sm text-gray-400'>
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
    </div>
  )
}
