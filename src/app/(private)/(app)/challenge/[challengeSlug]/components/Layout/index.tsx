'use client'

import React, { ReactNode } from 'react'

import { Tabs } from './Tabs'
import { useLayout } from './useLayout'

import { SecondsCounter } from '@/app/(private)/(app)/lesson/components/SecondsCounter'
import { PageTransitionAnimation } from '@/app/components/PageTransitionAnimation'
import { useChallengeStore } from '@/stores/challengeStore'

type LayoutProps = {
  header: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
}

export function Layout({ header, tabContent, codeEditor }: LayoutProps) {
  const { isTransitionPageVisible } = useLayout()
  const isEnd = useChallengeStore((store) => store.state.isEnd)

  return (
    <>
      <PageTransitionAnimation
        isVisible={isTransitionPageVisible}
        hasTips={true}
      />
      {!isEnd && <SecondsCounter />}
      <div className="relative md:overflow-hidden">
        {header}
        <main className="">
          {/* <div className="md:hidden">
      <Slider />
    </div> */}
          <div className="grid grid-cols-2 gap-3 overflow-hidden p-3">
            <Tabs>{tabContent}</Tabs>
            {codeEditor}
          </div>
        </main>
      </div>
    </>
  )
}
