import * as Tabs from '@radix-ui/react-tabs'
import { twMerge } from 'tailwind-merge'
import { Icon } from '@phosphor-icons/react'

interface TabButtonProps {
  title: string
  icon: Icon
  isActive: boolean
}

export function TabButton({ title, icon: Icon, isActive }: TabButtonProps) {
  return (
    <Tabs.Trigger
      className={twMerge(
        'p-3 rounded-md flex items-center gap-1 text-gray-100 font-medium',
        isActive ? 'bg-green-900 border border-green-600' : 'bg-transparent'
      )}
      value="tab1"
    >
      <Icon className="text-lg text-green-500" />
      {title}
    </Tabs.Trigger>
  )
}
