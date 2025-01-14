'use client'

import { useState } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRouter } from '@/ui/global/hooks/useRouter'

import type { ListingOrder } from './ListingOrder'
import type { TabContent } from './TabContent'

export function useCraftsTable() {
  const [activeTab, setActiveTab] = useState<TabContent>('snippets-tab')
  const [activeListingOrder] = useState<ListingOrder>('creation-date')

  const { user } = useAuthContext()
  const { currentRoute } = useRouter()
  const isAuthUser = currentRoute.split('/').slice(-1)[0] === user?.slug.value

  const buttonTitle: Record<TabContent, string | null> = {
    'snippets-tab': 'Criar código',
    'challenges-tab': 'Criar desafio',
    'solutions-tab': null,
  }

  function handleTabChange(tabContent: TabContent) {
    setActiveTab(tabContent as TabContent)
  }

  return {
    activeTab,
    activeListingOrder,
    isAuthUser,
    buttonTitle,
    handleTabChange,
  }
}
