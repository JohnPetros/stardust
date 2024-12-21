import * as Tabs from '@radix-ui/react-tabs'
import { twMerge } from 'tailwind-merge'

import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import { Icon } from '@/ui/global/widgets/components/Icon'

type TabButtonProps = {
  title: string
  icon: IconName
  value: string
  isActive: boolean
  onClick: VoidFunction
}

export function TabButton({ title, icon, value, isActive, onClick }: TabButtonProps) {
  return (
    <Tabs.Trigger
      className={twMerge(
        'flex items-center gap-2 rounded-md border px-3 py-2 font-medium text-gray-100',
        isActive ? 'border-green-600 bg-green-900' : 'border-transparent bg-transparent',
      )}
      value={value}
      onClick={onClick}
    >
      <Icon name={icon} className='hidden text-lg text-green-500 md:block' />
      {title}
    </Tabs.Trigger>
  )
}
