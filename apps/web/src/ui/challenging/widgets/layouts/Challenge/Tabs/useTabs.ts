'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { ROUTES } from '@/constants'
import type { ContentType } from '../types/ContentType'
import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'

export function useTabs() {
  const { getChallengeSlice, getCraftsVisibilitySlice } = useChallengeStore()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { challenge } = getChallengeSlice()
  const [activeTab, setActiveTab] = useState<ContentType>('description')
  const pathname = usePathname()
  const router = useRouter()
  const { user, updateUser } = useAuthContext()

  async function handleShowSolutions() {
    if (!user) return

    user.loseCoins(ChallengeCraftsVisibility.solutionsVisibilityPrice)
    await updateUser(user)
    setCraftsVislibility(craftsVislibility.showSolutions())
    router.push(`${ROUTES.challenging.challenge}/${challenge?.slug}/solutions`)
  }

  useEffect(() => {
    setActiveTab('description')

    if (!challenge) return

    const activeTab = pathname.split('/').pop()
    if (!activeTab) return

    if (activeTab !== challenge.slug.value) setActiveTab(activeTab as ContentType)
  }, [pathname, challenge])

  return {
    activeTab,
    handleShowSolutions,
  }
}
