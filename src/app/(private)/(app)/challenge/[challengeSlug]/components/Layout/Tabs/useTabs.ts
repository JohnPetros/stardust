import { useRef, useState } from 'react'

import { useChallengeStore } from '@/stores/challengeStore'

export type Tab = 'description' | 'result' | 'comments'

export function useTabs() {
  const { challenge, results } = useChallengeStore((store) => store.state)
  const [activeTab, setActiveTab] = useState<Tab>('description')
  const tabsRef = useRef<HTMLDivElement[]>([])

  function scrollTabToTop() {
    tabsRef.current.map((tab) => {
      tab.scrollTop = 0
    })
  }

  function handleTabButton(tab: Tab) {
    setActiveTab(tab)
  }

  function handleTabChange() {
    scrollTabToTop()
  }

  function addTabRef(ref: HTMLDivElement | null) {
    if (ref) {
      tabsRef.current.push(ref)
    }
  }

  return {
    activeTab,
    handleTabButton,
    handleTabChange,
    addTabRef,
  }
}
