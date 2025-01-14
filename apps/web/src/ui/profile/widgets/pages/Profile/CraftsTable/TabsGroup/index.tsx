'use client'

import * as Tabs from '@radix-ui/react-tabs'

import { TabButton } from './TabButton'
import { TAB_BUTTONS } from '../tab-buttons'
import type { TabContent } from '../TabContent'
import type { TabListSorter } from '../TabListSorter'
import { SorterButton } from './SorterButton'
import { SolutionsListTab } from './SolutionsListTab'
import { ChallengesListTab } from './ChallengesListTab'

const TAB_LIST_SORTER_BUTTONS_BY_TAB_CONTENT: Record<TabContent, TabListSorter[]> = {
  challengesListTab: ['date', 'upvotesCount'],
  solutionsListTab: ['date', 'upvotesCount', 'viewsCount'],
}

type TabsGroupProps = {
  activeTabContent: TabContent
  activeTabListSorter: TabListSorter
  userId: string
  onTabChange: (tabContent: TabContent) => void
}

export function TabsGroup({
  activeTabContent,
  activeTabListSorter,
  userId,
  onTabChange,
}: TabsGroupProps) {
  return (
    <Tabs.Root className='rounded-md bg-gray-800 p-6'>
      <Tabs.List className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-1'>
          {TAB_BUTTONS.map(({ title, icon, value }) => (
            <TabButton
              key={value}
              title={title}
              icon={icon}
              value={value}
              isActive={value === activeTabContent}
              onClick={() => onTabChange(value)}
            />
          ))}
        </div>

        <div className='flex items-center justify-end'>
          {TAB_LIST_SORTER_BUTTONS_BY_TAB_CONTENT[activeTabContent].map(
            (tabListSorter) => {
              switch (tabListSorter) {
                case 'upvotesCount':
                  return (
                    <SorterButton
                      title='Mais votados'
                      icon='arrow-up'
                      isActive={activeTabListSorter === 'upvotesCount'}
                    />
                  )
                case 'date':
                  return (
                    <SorterButton
                      title='Mais recentes'
                      icon='clock'
                      isActive={activeTabListSorter === 'date'}
                    />
                  )
              }
            },
          )}
        </div>
      </Tabs.List>

      <Tabs.Content value='challengesListTab'>
        <ChallengesListTab userId={userId} tabListSorter={activeTabListSorter} />
      </Tabs.Content>

      <Tabs.Content value='solutionsListTab'>
        <SolutionsListTab userId={userId} tabListSorter={activeTabListSorter} />
      </Tabs.Content>
    </Tabs.Root>
  )
}
