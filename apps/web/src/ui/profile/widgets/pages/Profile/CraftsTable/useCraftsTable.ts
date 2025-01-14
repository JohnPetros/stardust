'use client'

import { useState } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRouter } from '@/ui/global/hooks/useRouter'

import type { TabContent } from './TabContent'
import type { TabListSorter } from './TabListSorter'

export function useCraftsTable() {
  const [activeTabContent, setActiveTabContent] = useState<TabContent>('snippetsListTab')
  const [activeTabListSorter] = useState<TabListSorter>('date')

  const { user } = useAuthContext()
  const { currentRoute } = useRouter()
  const isAuthUser = currentRoute.split('/').slice(-1)[0] === user?.slug.value

  const buttonTitle: Record<TabContent, string | null> = {
    snippetsListTab: 'Criar snippet',
    challengesListTab: 'Criar desafio',
    solutionsListTab: null,
  }

  function handleTabChange(tabContent: TabContent) {
    setActiveTabContent(tabContent as TabContent)
  }

  return {
    activeTabContent,
    activeTabListSorter,
    isAuthUser,
    buttonTitle,
    handleTabChange,
  }
}
