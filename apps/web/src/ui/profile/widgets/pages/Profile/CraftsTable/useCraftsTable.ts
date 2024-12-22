'use client'

import { useState } from 'react'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRouter } from ''@/ui/global/hooks''

type TabValue = 'playground-tab' | 'challenges-tab' | 'solutions-tab'

type Order = 'created_at' | 'votes'

export function useCraftsTable() {
  const [activeTab, setActiveTab] = useState<TabValue>('playground-tab')
  const [canOrder, setCanOrder] = useState(false)
  const [activeOrder] = useState<Order>('created_at')

  const { user } = useAuthContext()
  const { getCurrentRoute } = useRouter()
  const isAuthUser = getCurrentRoute().split('/').slice(-1)[0] === user?.slug.value

  const buttonTitle: Record<TabValue, string | null> = {
    'playground-tab': 'Criar código',
    'challenges-tab': 'Criar desafio',
    'solutions-tab': null,
  }

  function handleTabChange(tabValue: string, canOrder: boolean) {
    setActiveTab(tabValue as TabValue)
    setCanOrder(canOrder)
  }

  return {
    activeTab,
    activeOrder,
    canOrder,
    isAuthUser,
    buttonTitle,
    handleTabChange,
  }
}
