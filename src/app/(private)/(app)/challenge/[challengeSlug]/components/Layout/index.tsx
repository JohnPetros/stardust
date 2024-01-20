'use client'

import React, { ReactNode } from 'react'

import { Tabs } from './Board'

type LayoutProps = {
  header: ReactNode
  board: ReactNode
  codeEditor: ReactNode
}

export function Layout({ header, board, codeEditor }: LayoutProps) {
  return (
    <div className="relative md:overflow-hidden">
      {header}
      <main className="">
        {/* <div className="md:hidden">
      <Slider />
    </div> */}
        <div className="grid grid-cols-2 gap-3 overflow-hidden p-3">
          <Tabs>{board}</Tabs>
          {codeEditor}
        </div>
      </main>
    </div>
  )
}
