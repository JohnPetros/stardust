'use client'

import * as Tab from '@radix-ui/react-tabs'

import { TabButton } from './TabButton'
import { OrderButton } from './OrderButton'
import { TAB_BUTTONS } from '../tab-buttons'

type TabsGroupProps = {
  activeTab: string
  canOrder: boolean
  activeOrder: string
  onTabChange: (value: string, canOrder: boolean) => void
}

export function TabsGroup({
  activeTab,
  activeOrder,
  canOrder,
  onTabChange,
}: TabsGroupProps) {
  return (
    <Tab.Root className='rounded-md bg-gray-800 p-6'>
      <Tab.List className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-1'>
          {TAB_BUTTONS.map(({ title, icon, value, canOrder }) => (
            <TabButton
              key={value}
              title={title}
              icon={icon}
              value={value}
              isActive={value === activeTab}
              onClick={() => onTabChange(value, canOrder)}
            />
          ))}
        </div>

        {canOrder && (
          <div className='flex items-center justify-end'>
            <OrderButton
              title='Mais recentes'
              icon='clock'
              isActive={activeOrder === 'created_at'}
            />
            <OrderButton
              title='Mais votados'
              icon='arrow-up'
              isActive={activeOrder === 'votes'}
            />
          </div>
        )}
      </Tab.List>
    </Tab.Root>
  )
}
