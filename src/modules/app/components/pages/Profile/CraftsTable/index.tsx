'use client'

import Link from 'next/link'

import { useCraftsTable } from './useCraftsTable'
import { Button } from '@/modules/global/components/shared/Button'
import { TabsGroup } from './Tabs'
import { Icon } from '@/modules/global/components/shared/Icon'
import { TAB_BUTTONS } from './tab-buttons'

export function CraftsTable() {
  const { activeOrder, activeTab, buttonTitle, handleTabChange, canOrder, isAuthUser } =
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
        activeOrder={activeOrder}
        onTabChange={handleTabChange}
        canOrder={canOrder}
      />
    </div>
  )
}
