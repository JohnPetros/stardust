'use client'

import type { ReactNode } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { AnimatedContent } from './AnimatedContent'

type TabContent = {
  children: ReactNode
  value: string
}

export function TabContent({ children, value }: TabContent) {
  return (
    <Tabs.Content
      value={value}
      className='h-[calc(100vh-8rem)] overflow-hidden overflow-y-scroll'
      forceMount
    >
      <AnimatedContent>{children}</AnimatedContent>
    </Tabs.Content>
  )
}
