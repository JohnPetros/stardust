'use client'

import type { ReactNode } from 'react'

import type { PanelsOffset } from './types'

type ChallengeLayoutProps = {
  header: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
  panelsOffset: PanelsOffset
}

export async function ChallengeLayout({
  header,
  tabContent,
  codeEditor,
  panelsOffset,
}: ChallengeLayoutProps) {
  return null
}
