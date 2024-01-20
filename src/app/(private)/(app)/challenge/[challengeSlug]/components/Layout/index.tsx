'use client'

import React, { ReactNode } from 'react'

import { Tabs } from './Tabs'
import { useLayout } from './useLayout'

import { PageTransitionAnimation } from '@/app/components/PageTransitionAnimation'

type LayoutProps = {
  header: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
}

export function Layout({ header, tabContent, codeEditor }: LayoutProps) {
  const { isTransitionPageVisible } = useLayout()

  return (
    <>
      <PageTransitionAnimation
        isVisible={isTransitionPageVisible}
        hasTips={true}
      />
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
