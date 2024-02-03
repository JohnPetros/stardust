'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { ContentType } from '..'

import { useAuth } from '@/contexts/AuthContext'
import { useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/utils/constants'

export function useTabs() {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const setCanShowComments = useChallengeStore(
    (store) => store.actions.setCanShowComments
  )
  const setCanShowSolutions = useChallengeStore(
    (store) => store.actions.setCanShowSolutions
  )
  const isEnd = useChallengeStore((store) => store.state.isEnd)

  const [activeTab, setActiveTab] = useState<ContentType>('description')

  const pathname = usePathname()
  const router = useRouter()
  const { user, updateUser } = useAuth()

  async function handleShowSolutions() {
    if (!user) return

    await updateUser({ coins: user.coins - 10 })
    setCanShowSolutions(true)
    router.push(`${ROUTES.private.challenge}/${challenge?.slug}/solutions`)
  }

  useEffect(() => {
    setCanShowComments(isEnd)
  }, [isEnd, setCanShowComments])

  useEffect(() => {
    setActiveTab('description')

    if (!challenge) return

    const activeTab = pathname.split('/').pop()

    if (activeTab !== challenge.slug) setActiveTab(activeTab as ContentType)
  }, [pathname, challenge])

  return {
    activeTab,
    handleShowSolutions,
  }
}
