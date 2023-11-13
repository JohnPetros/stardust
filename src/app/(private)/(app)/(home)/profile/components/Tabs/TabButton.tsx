import { Icon } from '@phosphor-icons/react'
import * as Tabs from '@radix-ui/react-tabs'
import { twMerge } from 'tailwind-merge'

interface TabButtonProps {
  title: string
  icon: Icon
  value: string
  isActive: boolean
  onClick: VoidFunction
}

export function TabButton({
  title,
  icon: Icon,
  value,
  isActive,
  onClick,
}: TabButtonProps) {
  return (
    <Tabs.Trigger
      className={twMerge(
        'flex items-center gap-2 rounded-md border px-3 py-2 font-medium text-gray-100',
        isActive
          ? 'border-green-600 bg-green-900'
          : 'border-transparent bg-transparent'
      )}
      value={value}
      onClick={onClick}
    >
      <Icon className="hidden text-lg text-green-500 md:block" />
      {title}
    </Tabs.Trigger>
  )
}
