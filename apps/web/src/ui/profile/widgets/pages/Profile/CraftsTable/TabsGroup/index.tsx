'use client'

import * as Tab from '@radix-ui/react-tabs'

import { TabButton } from './TabButton'
import { OrderButton } from './OrderButton'
import { TAB_BUTTONS } from '../tab-buttons'
import type { ListingOrder } from '../ListingOrder'
import type { TabContent } from '../TabContent'

const LISTING_ORDER_BUTTONS_BY_TAB_CONTENT: Record<TabContent, ListingOrder[]> = {
  'challenges-tab': ['upvotes', 'creation-date'],
  'solutions-tab': ['upvotes', 'creation-date'],
  'snippets-tab': [],
}

type TabsGroupProps = {
  activeTab: TabContent
  activeListingOrder: ListingOrder
  onTabChange: (tabContent: TabContent) => void
}

export function TabsGroup({
  activeTab,
  activeListingOrder,
  onTabChange,
}: TabsGroupProps) {
  return (
    <Tab.Root className='rounded-md bg-gray-800 p-6'>
      <Tab.List className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-1'>
          {TAB_BUTTONS.map(({ title, icon, value }) => (
            <TabButton
              key={value}
              title={title}
              icon={icon}
              value={value}
              isActive={value === activeTab}
              onClick={() => onTabChange(value)}
            />
          ))}
        </div>

        <div className='flex items-center justify-end'>
          {LISTING_ORDER_BUTTONS_BY_TAB_CONTENT[activeTab].map((listingOrder) => {
            switch (listingOrder) {
              case 'upvotes':
                return (
                  <OrderButton
                    title='Mais votados'
                    icon='arrow-up'
                    isActive={activeListingOrder === 'upvotes'}
                  />
                )
              case 'creation-date':
                return (
                  <OrderButton
                    title='Mais recentes'
                    icon='clock'
                    isActive={activeListingOrder === 'creation-date'}
                  />
                )
            }
          })}
        </div>
      </Tab.List>
    </Tab.Root>
  )
}
