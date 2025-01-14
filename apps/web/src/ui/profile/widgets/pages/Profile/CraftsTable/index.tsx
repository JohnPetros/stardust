'use client'

import Link from 'next/link'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/global/widgets/components/Button'
import { TabsGroup } from './TabsGroup'
import { TAB_BUTTONS } from './tab-buttons'
import { useCraftsTable } from './useCraftsTable'

type CraftsTableProps = {
  userId: string
}

export function CraftsTable({ userId }: CraftsTableProps) {
  const {
    activeTabListSorter,
    activeTabContent,
    buttonTitle,
    isAuthUser,
    handleTabChange,
  } = useCraftsTable()

  return (
    <div className='flex flex-col gap-6'>
      {isAuthUser && activeTabContent !== 'solutionsListTab' && (
        <Link
          href={TAB_BUTTONS.find((tab) => tab.value === activeTabContent)?.link ?? ''}
        >
          <Button className='w-64 gap-2'>
            <Icon name='plus' className='text-gray-900' weight='bold' />
            {buttonTitle[activeTabContent]}
          </Button>
        </Link>
      )}

      <TabsGroup
        userId={userId}
        activeTabContent={activeTabContent}
        activeTabListSorter={activeTabListSorter}
        onTabChange={handleTabChange}
      />
    </div>
  )
}
