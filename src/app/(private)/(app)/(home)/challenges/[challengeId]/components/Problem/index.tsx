import { useEffect, useRef, useState } from 'react'
import { useChallengeContext } from '@/hooks/useChallengeContext'

import { Description } from './Description'
import { Result } from '../Result'
import * as Tabs from '@radix-ui/react-tabs'

const tabStyle = 'h-[calc(100vh-8rem)] overflow-y-scroll overflow-hidden '

export function Problem() {
  const {
    state: { challenge },
  } = useChallengeContext()
  const tabsRef = useRef<HTMLDivElement[]>([])

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

  useEffect(() => {
    if (tabsRef.current.length) scrollTabToTop()
  }, [challenge, tabsRef.current])

  if (challenge)
    return (
      <div className="w-full max-h-screen border-4 border-gray-700 rounded-md">
        <Tabs.Root defaultValue="description" onValueChange={handleTabChange}>
          <Tabs.List className="flex items-center gap-3 bg-gray-700 px-2">
            <Tabs.Trigger className="text-green-500 p-2" value="description">
              Descrição
            </Tabs.Trigger>
            <Tabs.Trigger className="text-green-500 p-2" value="result">
              Resultado
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            ref={(ref) => {
              if (ref) {
                tabsRef.current.push(ref)
              }
            }}
            value="description"
            className={tabStyle}
          >
            <Description />
          </Tabs.Content>
          <Tabs.Content
            ref={(ref) => {
              if (ref) {
                tabsRef.current.push(ref)
              }
            }}
            value="result"
            className={tabStyle}
          >
            <Result />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    )
}
