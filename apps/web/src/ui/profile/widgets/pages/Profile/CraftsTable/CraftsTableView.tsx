import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/global/widgets/components/Button'
import { TabsGroup } from './TabsGroup'
import type { TabContent } from './TabContent'
import type { TabListSorter } from './TabListSorter'

type Props = {
  userId: string
  isAccountUser: boolean
  activeTabContent: TabContent
  activeTabListSorter: TabListSorter
  onTabContentChange: (tabContent: TabContent) => void
  onTabListSorterChange: (tabListSorter: TabListSorter) => void
}

export const CraftsTableView = ({
  userId,
  isAccountUser,
  activeTabContent,
  activeTabListSorter,
  onTabContentChange,
  onTabListSorterChange,
}: Props) => {
  return (
    <div className='flex flex-col gap-6'>
      {isAccountUser && activeTabContent === 'challengesListTab' && (
        <Link href={ROUTES.challenging.challenge()}>
          <Button className='w-64 gap-2'>
            <Icon name='plus-circle' size={16} className='text-gray-900' weight='bold' />
            Postar um desafio
          </Button>
        </Link>
      )}

      <TabsGroup
        userId={userId}
        activeTabContent={activeTabContent}
        activeTabListSorter={activeTabListSorter}
        onTabContentChange={onTabContentChange}
        onTabListSorterChange={onTabListSorterChange}
      />
    </div>
  )
}
