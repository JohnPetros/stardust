import { Lock } from '@phosphor-icons/react'
import * as Tabs from '@radix-ui/react-tabs'
import { twMerge } from 'tailwind-merge'

import type { Tab } from '.'

import { Tooltip } from '@/app/components/@Tooltip'

interface TabButtonProps {
  value: Tab
  isActive: boolean
  title: string
  isBlocked?: boolean
  blockMessage?: string
  onClick: (value: Tab) => void
}

export function TabButton({
  value,
  isActive,
  isBlocked,
  blockMessage,
  title,
  onClick,
}: TabButtonProps) {
  return (
    <Tabs.Trigger
      onClick={() => (isBlocked ? null : onClick(value))}
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
        <>
          {blockMessage ? (
            <Tooltip content={blockMessage} direction="bottom">
              <div className="flex items-center gap-2">
                {title}
                <Lock className="text-gray-500" />
              </div>
            </Tooltip>
          ) : (
            <span className="flex items-center gap-2">
              {title}
              <Lock className="text-gray-500" />
            </span>
          )}
        </>
      ) : (
        <span>{title}</span>
      )}
    </Tabs.Trigger>
  )
}
