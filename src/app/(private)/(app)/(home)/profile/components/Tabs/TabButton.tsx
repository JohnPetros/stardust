import * as Tabs from '@radix-ui/react-tabs'
import { twMerge } from 'tailwind-merge'
import { Icon } from '@phosphor-icons/react'

interface TabButtonProps {
  title: string
  icon: Icon
  value: string
  isActive: boolean
  onClick: VoidFunction
}

export function TabButton({ title, icon: Icon, value, isActive, onClick }: TabButtonProps) {
  return (
    <Tabs.Trigger
      className={twMerge(
        'p-2 rounded-md flex items-center gap-2 text-gray-100 font-medium border',
        isActive ? 'bg-green-900 border-green-600' : 'bg-transparent border-transparent'
      )}
      value={value}
      onClick={onClick}
    >
      <Icon className="text-lg text-green-500" />
      {title}
    </Tabs.Trigger>
  )
}
