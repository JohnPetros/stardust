'use client'

import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/global/widgets/components/Button'
import { TabsGroup } from './TabsGroup'
import { useCraftsTable } from './useCraftsTable'

type CraftsTableProps = {
  userId: string
}

export function CraftsTable({ userId }: CraftsTableProps) {
  const {
    activeTabListSorter,
    activeTabContent,
    isAuthUser,
    handleTabContentChange,
    handleTabListSorterChange,
  } = useCraftsTable()

  return (
    <div className='flex flex-col gap-6'>
      {isAuthUser && activeTabContent === 'challengesListTab' && (
        <Link href={ROUTES.challenging.challenge()}>
          <Button className='w-64 gap-2'>
            <Icon name='plus' size={16} className='text-gray-900' weight='bold' />
            Postar um desafio
          </Button>
        </Link>
      )}

      <TabsGroup
        userId={userId}
        activeTabContent={activeTabContent}
        activeTabListSorter={activeTabListSorter}
        onTabContentChange={handleTabContentChange}
        onTabListSorterChange={handleTabListSorterChange}
      />
    </div>
  )
}
