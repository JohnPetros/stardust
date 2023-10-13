import { useRef } from 'react'

import { twMerge } from 'tailwind-merge'

import * as Tabs from '@radix-ui/react-tabs'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipRef,
} from '@/app/components/Tooltip'
import { Lock } from '@phosphor-icons/react'

import type { Tab } from '.'

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
  const tooltipRef = useRef<TooltipRef>(null)

  return (
    <Tabs.Trigger
      onClick={() => (isBlocked ? null : onClick(value))}
      className={twMerge(
        'text-sm p-2',
        isActive
          ? 'text-green-500 p-2'
          : isBlocked
          ? 'text-gray-500 opacity-50 flex items-center gap-2'
          : 'text-gray-100'
      )}
      value={value}
    >
      {isBlocked ? (
        <>
          {blockMessage ? (
            <Tooltip>
              <TooltipTrigger tooltipRef={tooltipRef}>
                <div className="flex items-center gap-2">
                  {title}
                  <Lock className="text-gray-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent ref={tooltipRef} text={blockMessage} />
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
