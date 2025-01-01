'use client'

import { useEffect, useState } from 'react'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { ROUTES } from '@/constants'
import type { ContentType } from '../types/ContentType'
import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useTabs() {
  const { getChallengeSlice, getCraftsVisibilitySlice } = useChallengeStore()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { challenge } = getChallengeSlice()
  const [activeTab, setActiveTab] = useState<ContentType>('description')
  const router = useRouter()
  const toast = useToastContext()
  const { user, updateUser } = useAuthContext()

  async function handleShowSolutions() {
    if (!user) return

    if (user.canBuy(ChallengeCraftsVisibility.solutionsVisibilityPrice).isFalse) {
      toast.show('Você não possui moedas suficiente')
      return
    }

    user.loseCoins(ChallengeCraftsVisibility.solutionsVisibilityPrice)
    await updateUser(user)
    setCraftsVislibility(craftsVislibility.showSolutions())
    router.goTo(`${ROUTES.challenging.challenge}/${challenge?.slug}/solutions`)
  }

  useEffect(() => {
    setActiveTab('description')

    if (!challenge) return

    const activeTab = router.currentRoute.split('/').pop()
    if (!activeTab) return

    if (activeTab !== challenge.slug.value) setActiveTab(activeTab as ContentType)
  }, [router.currentRoute, challenge])

  return {
    activeTab,
    handleShowSolutions,
  }
}
