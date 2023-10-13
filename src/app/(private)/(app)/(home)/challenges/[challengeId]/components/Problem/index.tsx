'use client'

import { useEffect, useRef, useState } from 'react'
import { useChallengeStore } from '@/hooks/useChallengeStore'

import { Description } from './Description'
import { Result } from '../Result'
import { TabButton } from './TabButton'
import TabContent from './TabContent'
import * as Tabs from '@radix-ui/react-tabs'

import { AnimatePresence } from 'framer-motion'

export type Tab = 'description' | 'result' | 'comments'

export function Problem() {
  const {
    state: { challenge, results },
  } = useChallengeStore()
  const tabsRef = useRef<HTMLDivElement[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('description')

  function scrollTabToTop() {
    tabsRef.current.map((tab) => {
      tab.scrollTop = 0
    })
  }

  function addTabRef(ref: HTMLDivElement | null) {
    if (ref) {
      tabsRef.current.push(ref)
    }
  }

  function handleTabChange() {
    scrollTabToTop()
  }

  function handleTabButton(tab: Tab) {
    setActiveTab(tab)
  }

  useEffect(() => {
    if (tabsRef.current.length) scrollTabToTop()
  }, [challenge, activeTab])

  useEffect(() => {
    if (results.length) {
      setActiveTab('result')
    }
  }, [results])

  if (challenge)
    return (
      <div className="w-full max-h-screen border-4 border-gray-700 rounded-md">
        <Tabs.Root
          defaultValue="description"
          onValueChange={handleTabChange}
          orientation="horizontal"
        >
          <Tabs.List className="flex items-center gap-3 bg-gray-700 px-2">
            <TabButton
              title="Descrição"
              value="description"
              isActive={activeTab === 'description'}
              onClick={handleTabButton}
            />
            <TabButton
              title="Resultado"
              value="result"
              isActive={activeTab === 'result'}
              onClick={handleTabButton}
            />
            <TabButton
              title="Comentários"
              value="comments"
              isActive={activeTab === 'comments'}
              isBlocked
              blockMessage="Comentários estão disponíveis apenas após a conclusão do desafio."
              onClick={handleTabButton}
            />
          </Tabs.List>
          <AnimatePresence>
            {activeTab === 'description' && (
              <TabContent tabRef={addTabRef} value="description">
                <Description />
              </TabContent>
            )}
            {activeTab === 'result' && (
              <TabContent tabRef={addTabRef} value="result">
                <Result />
              </TabContent>
            )}
          </AnimatePresence>
        </Tabs.Root>
      </div>
    )
}
