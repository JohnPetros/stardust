import { useEffect, useRef, useState } from 'react'
import { useChallengeContext } from '@/hooks/useChallengeContext'

import { Description } from './Description'
import { Result } from '../Result'
import * as Tabs from '@radix-ui/react-tabs'
import { useChallengeStore } from '@/hooks/useChallengeStore'

const tabStyle = 'h-[calc(100vh-8rem)] overflow-y-scroll overflow-hidden'

type Tab = 'description' | 'result'

export function Problem() {
  // const {
  //   state: { challenge },
  // } = useChallengeContext()
  const {
    state: { challenge, results },
  } = useChallengeStore()
  const tabsRef = useRef<HTMLDivElement[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('description')

  function scrollTabToTop() {
    tabsRef.current.map((tab) => {
      tab.scrollTo({
        top: 0,
      })
    })
  }

  function handleTabChange() {
    scrollTabToTop()
  }

  function handleTabButton(tab: Tab) {
    setActiveTab(tab)
  }

  useEffect(() => {
    if (tabsRef.current.length) scrollTabToTop()
  }, [activeTab, tabsRef.current])

  if (challenge)
    return (
      <div className="w-full max-h-screen border-4 border-gray-700 rounded-md">
        <Tabs.Root
          defaultValue="description"
          onValueChange={handleTabChange}
          orientation="horizontal"
        >
          <Tabs.List className="flex items-center gap-3 bg-gray-700 px-2">
            <Tabs.Trigger
              onClick={() => handleTabButton('description')}
              className="text-green-500 p-2"
              value="description"
            >
              Descrição
            </Tabs.Trigger>
            <Tabs.Trigger
              onClick={() => handleTabButton('result')}
              className="text-green-500 p-2"
              value="result"
            >
              Resultado
            </Tabs.Trigger>
          </Tabs.List>
          {activeTab === 'description' && (
            <Tabs.Content
              ref={(ref) => {
                if (ref) {
                  tabsRef.current.push(ref)
                }
              }}
              value="description"
              className={tabStyle}
              forceMount
            >
              <Description />
            </Tabs.Content>
          )}
          {activeTab === 'result' && (
            <Tabs.Content
              ref={(ref) => {
                if (ref) {
                  tabsRef.current.push(ref)
                }
              }}
              value="result"
              className={tabStyle}
              forceMount
            >
              <Result />
            </Tabs.Content>
          )}
        </Tabs.Root>
      </div>
    )
}
