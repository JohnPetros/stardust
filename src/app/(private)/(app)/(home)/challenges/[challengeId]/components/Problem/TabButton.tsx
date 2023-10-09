import * as Tabs from '@radix-ui/react-tabs'
import { twMerge } from 'tailwind-merge'

import type { Tab } from '.'

interface TabButtonProps {
  value: Tab
  isActive: boolean
  title: string
  onClick: (value: Tab) => void
}

export function TabButton({ value, isActive, title, onClick }: TabButtonProps) {
  return (
    <Tabs.Trigger
      onClick={() => onClick(value)}
      className={twMerge(
        'text-sm p-2',
        isActive ? 'text-green-500 p-2' : 'text-gray-100'
      )}
      value={value}
    >
      {title}
    </Tabs.Trigger>
  )
}
