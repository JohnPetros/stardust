'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/utils/constants'

export type Tab = 'description' | 'result' | 'comments'

export function useTabs() {
  const challengeSlug = useChallengeStore(
    (store) => store.state.challenge?.slug
  )

  const [activeTab, setActiveTab] = useState<Tab>('description')
  const tabsRef = useRef<HTMLDivElement[]>([])
  const router = useRouter()
  const pathname = usePathname()

  function scrollTabToTop() {
    tabsRef.current.map((tab) => {
      tab.scrollTop = 0
    })
  }

  function handleTabButton(tab: Tab) {
    setActiveTab(tab)

    const route = tab !== 'description' ? `/${tab}` : ''

    router.push(`${ROUTES.private.challenge}/${challengeSlug}${route}`)
  }

  function handleTabChange() {
    scrollTabToTop()
  }

  function addTabRef(ref: HTMLDivElement | null) {
    if (ref) {
      tabsRef.current.push(ref)
    }
  }

  useEffect(() => {
    const activeTab = pathname.split('/').pop()

    if (activeTab !== challengeSlug) setActiveTab(activeTab as Tab)
  }, [pathname, challengeSlug])

  return {
    activeTab,
    handleTabButton,
    handleTabChange,
    addTabRef,
  }
}
