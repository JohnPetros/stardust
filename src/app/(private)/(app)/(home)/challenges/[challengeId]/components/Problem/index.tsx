'use client'

import { useEffect, useRef, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { AnimatePresence } from 'framer-motion'

import { Result } from '../Result'

import { Description } from './Description'
import { TabButton } from './TabButton'
import { TabContent } from './TabContent'

import { useChallengeStore } from '@/stores/challengeStore'

export type Tab = 'description' | 'result' | 'comments'

export function Problem() {
  const { challenge, results } = useChallengeStore((store) => store.state)
  const [activeTab, setActiveTab] = useState<Tab>('description')
  const tabsRef = useRef<HTMLDivElement[]>([])

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
      <div className="max-h-screen w-full rounded-md border-4 border-gray-700">
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
