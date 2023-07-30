'use client'
import { Icon } from '@phosphor-icons/react'
import { Tooltip, Trigger, Content } from '@/app/components/Tooltip'

interface InfoProps {
  label: string | number
  icon: Icon
  tooltipText: string
}

export function Info({ label, icon: Icon, tooltipText }: InfoProps) {
  return (
    <li className="text-sm text-gray-400">
      <Tooltip>
        <Trigger className='flex items-center gap-1'>
          <Icon className="text-gray-400 text-sm" weight="bold" />
          {label}
        </Trigger>
        <Content text={tooltipText} />
      </Tooltip>
    </li>
  )
}
