'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext'
import { useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/utils/constants'

export type Tab = 'description' | 'result' | 'comments' | 'solutions'

export function useTabs() {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const setCanShowComments = useChallengeStore(
    (store) => store.actions.setCanShowComments
  )
  const setCanShowSolutions = useChallengeStore(
    (store) => store.actions.setCanShowSolutions
  )
  const isEnd = useChallengeStore((store) => store.state.isEnd)

  const [activeTab, setActiveTab] = useState<Tab>('description')

  const pathname = usePathname()
  const router = useRouter()
  const { user, updateUser } = useAuth()

  function handleTabButton(tab: Tab) {
    setActiveTab(tab)

    const route = tab !== 'description' ? `/${tab}` : ''

    router.push(`${ROUTES.private.challenge}/${challenge?.slug}${route}`)
  }

  async function handleShowSolutions() {
    if (!user) return

    await updateUser({ coins: user.coins - 10 })
    setCanShowSolutions(true)
    handleTabButton('solutions')
  }

  useEffect(() => {
    if (challenge) setCanShowSolutions(challenge.isCompleted ?? false)
  }, [challenge, setCanShowSolutions])

  useEffect(() => {
    setCanShowComments(isEnd)
  }, [isEnd, setCanShowComments])

  useEffect(() => {
    setActiveTab('description')

    if (!challenge) return

    const activeTab = pathname.split('/').pop()

    console.log({ activeTab })

    if (activeTab !== challenge.slug) setActiveTab(activeTab as Tab)
  }, [pathname, challenge])

  return {
    activeTab,
    handleTabButton,
    handleShowSolutions,
  }
}
