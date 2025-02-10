'use client'

import * as Tabs from '@radix-ui/react-tabs'

import { TabButton } from './TabButton'
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
  onTabContentChange: (tabContent: TabContent) => void
  onTabListSorterChange: (tabListSorter: TabListSorter) => void
}

export function TabsGroup({
  activeTabContent,
  activeTabListSorter,
  userId,
  onTabContentChange,
  onTabListSorterChange,
}: TabsGroupProps) {
  return (
    <Tabs.Root value={activeTabContent} className='rounded-md bg-gray-800 p-6'>
      <Tabs.List className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-1'>
          <TabButton
            title='Desafios'
            icon='terminal'
            value='challengesListTab'
            isActive={activeTabContent === 'challengesListTab'}
            onClick={() => onTabContentChange('challengesListTab')}
          />
          <TabButton
            title='Soluções'
            icon='lightbulb'
            value='solutionsListTab'
            isActive={activeTabContent === 'solutionsListTab'}
            onClick={() => onTabContentChange('solutionsListTab')}
          />
        </div>

        <div className='flex items-center justify-end'>
          {TAB_LIST_SORTER_BUTTONS_BY_TAB_CONTENT[activeTabContent].map(
            (tabListSorter) => {
              switch (tabListSorter) {
                case 'date':
                  return (
                    <SorterButton
                      title='Mais recentes'
                      icon='clock'
                      isActive={activeTabListSorter === 'date'}
                      onClick={() => onTabListSorterChange('date')}
                    />
                  )
                case 'upvotesCount':
                  return (
                    <SorterButton
                      title='Mais votados'
                      icon='arrow-up'
                      isActive={activeTabListSorter === 'upvotesCount'}
                      onClick={() => onTabListSorterChange('upvotesCount')}
                    />
                  )
                case 'viewsCount':
                  return (
                    <SorterButton
                      title='Mais visualizados'
                      icon='double-eyes'
                      isActive={activeTabListSorter === 'viewsCount'}
                      onClick={() => onTabListSorterChange('viewsCount')}
                    />
                  )
              }
            },
          )}
        </div>
      </Tabs.List>

      <Tabs.Content value='challengesListTab' className='mt-6'>
        <ChallengesListTab userId={userId} tabListSorter={activeTabListSorter} />
      </Tabs.Content>

      <Tabs.Content value='solutionsListTab' className='mt-6'>
        <SolutionsListTab userId={userId} tabListSorter={activeTabListSorter} />
      </Tabs.Content>
    </Tabs.Root>
  )
}
