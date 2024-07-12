'use client'

import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import type { IconName } from '@/modules/global/components/shared/Icon/types'
import { AnimatedTitle } from './AnimatedTitle'
import { Icon } from '@/modules/global/components/shared/Icon'
import { Tooltip } from '@/modules/global/components/shared/Tooltip'

type SidenavButtonProps = {
  icon: IconName
  title: string
  isExpanded: boolean
  isActive: boolean
  countBadge?: ReactNode
  onClick: VoidFunction
}

export function SidenavButton({
  icon,
  title,
  isExpanded,
  isActive,
  countBadge,
  onClick,
}: SidenavButtonProps) {
  return (
    <Tooltip content={!isExpanded ? title : ''} direction='right'>
      <button
        type='button'
        onClick={onClick}
        className={twMerge(
          'relative flex h-auto w-max items-center justify-center rounded-md bg-transparent p-3 text-sm text-gray-100 outline-green-500 transition-colors duration-200 hover:bg-green-700/30',
          isActive ? 'bg-green-500/30' : ''
        )}
      >
        <Icon name={icon} className='text-lg text-green-400' />

        <AnimatedTitle isExpanded={isExpanded}>{title}</AnimatedTitle>

        {countBadge && countBadge}
      </button>
    </Tooltip>
  )
}
