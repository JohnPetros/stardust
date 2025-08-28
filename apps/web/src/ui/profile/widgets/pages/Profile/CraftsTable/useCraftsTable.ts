import { useState } from 'react'

import type { TabContent } from './TabContent'
import type { TabListSorter } from './TabListSorter'

export function useCraftsTable(currentRoute: string, userSlug: string) {
  const [activeTabContent, setActiveTabContent] =
    useState<TabContent>('challengesListTab')
  const [activeTabListSorter, setActiveTabListSorter] = useState<TabListSorter>('date')
  const isAccountUser = currentRoute.split('/').slice(-1)[0] === userSlug

  function handleTabContentChange(tabContent: TabContent) {
    setActiveTabContent(tabContent)
  }

  function handleTabListSorterChange(tabListSorter: TabListSorter) {
    setActiveTabListSorter(tabListSorter)
  }

  return {
    activeTabContent,
    activeTabListSorter,
    isAccountUser,
    handleTabContentChange,
    handleTabListSorterChange,
  }
}
