'use client'

import Link from 'next/link'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/global/widgets/components/Button'
import { TabsGroup } from './TabsGroup'
import { TAB_BUTTONS } from './tab-buttons'
import { useCraftsTable } from './useCraftsTable'

export function CraftsTable() {
  const { activeListingOrder, activeTab, buttonTitle, isAuthUser, handleTabChange } =
    useCraftsTable()

  return (
    <div className='flex flex-col gap-6'>
      {isAuthUser && activeTab !== 'solutions-tab' && (
        <Link href={TAB_BUTTONS.find((tab) => tab.value === activeTab)?.link ?? ''}>
          <Button className='w-64 gap-2'>
            <Icon name='plus' className='text-gray-900' weight='bold' />
            {buttonTitle[activeTab]}
          </Button>
        </Link>
      )}

      <TabsGroup
        activeTab={activeTab}
        activeListingOrder={activeListingOrder}
        onTabChange={handleTabChange}
      />
    </div>
  )
}
