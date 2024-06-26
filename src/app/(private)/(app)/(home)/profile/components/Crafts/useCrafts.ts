'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'

type TabValue = 'playground-tab' | 'challenges-tab' | 'solutions-tab'

type Sorter = 'created_at' | 'votes'

export function useCrafts() {
  const [activeTab, setActiveTab] = useState<TabValue>('playground-tab')
  const [hasSorters, setHasSorters] = useState(false)
  const [activeSorter] = useState<Sorter>('created_at')

  const { user } = useAuthContext()
  const pathname = usePathname()
  const isAuthUser = pathname.split('/').slice(-1)[0] === user?.slug

  const buttonTitle: Record<TabValue, string | null> = {
    'playground-tab': 'Criar código',
    'challenges-tab': 'Criar desafio',
    'solutions-tab': null,
  }

  function handleTabClick(tabValue: TabValue, hasSorters: boolean) {
    setActiveTab(tabValue)
    setHasSorters(hasSorters)
  }

  return {
    activeTab,
    activeSorter,
    hasSorters,
    isAuthUser,
    buttonTitle,
    handleTabClick,
  }
}
