'use client'

import { useState } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRouter } from '@/ui/global/hooks/useRouter'

import type { TabContent } from './TabContent'
import type { TabListSorter } from './TabListSorter'

export function useCraftsTable() {
  const [activeTabContent, setActiveTabContent] =
    useState<TabContent>('challengesListTab')
  const [activeTabListSorter, setActiveTabListSorter] = useState<TabListSorter>('date')

  const { user } = useAuthContext()
  const { currentRoute } = useRouter()
  const isAuthUser = currentRoute.split('/').slice(-1)[0] === user?.slug.value

  function handleTabContentChange(tabContent: TabContent) {
    setActiveTabContent(tabContent)
  }

  function handleTabListSorterChange(tabListSorter: TabListSorter) {
    setActiveTabListSorter(tabListSorter)
  }

  return {
    activeTabContent,
    activeTabListSorter,
    isAuthUser,
    handleTabContentChange,
    handleTabListSorterChange,
  }
}
