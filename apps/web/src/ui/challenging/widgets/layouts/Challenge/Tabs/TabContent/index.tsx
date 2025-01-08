'use client'

import { useRef, type ReactNode } from 'react'
import * as Tabs from '@radix-ui/react-tabs'

import { AnimatedContent } from './AnimatedContent'
import { useTabContent } from './useTabContent'

type TabContent = {
  children: ReactNode
  value: string
}

export function TabContent({ children, value }: TabContent) {
  const contentRef = useRef<HTMLDivElement>(null)
  useTabContent(contentRef)

  return (
    <Tabs.Content
      ref={contentRef}
      value={value}
      className='h-[calc(100vh-8rem)] overflow-hidden overflow-y-scroll'
      forceMount
    >
      <AnimatedContent>{children}</AnimatedContent>
    </Tabs.Content>
  )
}
