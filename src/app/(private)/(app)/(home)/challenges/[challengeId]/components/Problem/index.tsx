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
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  useEffect(() => {
    const selectedTabRef = tabsRef.current[selectedTabIndex]
    if (selectedTabRef)
      selectedTabRef.scrollTo({
        top: 0,
      })
  }, [challenge, selectedTabIndex, tabsRef])

  if (challenge)
    return (
      <div className="w-full max-h-screen border-4 border-gray-700 rounded-md">
        <Tabs.Root defaultValue="description">
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
