'use client'

import { Lock } from '@phosphor-icons/react'
import * as Tabs from '@radix-ui/react-tabs'
import { twMerge } from 'tailwind-merge'

import { Tab } from '../useTabs'

type TabButtonProps = {
  value: Tab
  isActive: boolean
  title: string
  isBlocked?: boolean
  blockMessage?: string
  onClick?: (value: Tab) => void
}

export function TabButton({
  value,
  isActive,
  isBlocked = false,
  title,
  onClick,
}: TabButtonProps) {
  return (
    <Tabs.Trigger
      onClick={() => (isBlocked || !onClick ? null : onClick(value))}
      className={twMerge(
        'p-2 text-sm',
        isActive
          ? 'p-2 text-green-500'
          : isBlocked
          ? 'flex items-center gap-2 text-gray-500 opacity-50'
          : 'text-gray-100'
      )}
      value={value}
    >
      {isBlocked ? (
        <span className="flex items-center gap-2">
          {title}
          <Lock className="text-gray-500" />
        </span>
      ) : (
        title
      )}
    </Tabs.Trigger>
  )
}
