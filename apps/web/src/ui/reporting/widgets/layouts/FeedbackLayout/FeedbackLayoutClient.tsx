'use client'

import { FeedbackLayoutView } from './FeedbackLayoutView'
import { useFeedbackLayout } from './useFeedbackLayout'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  isEnabled: boolean
}

export function FeedbackLayoutClient({ children, isEnabled }: Props) {
  const layout = useFeedbackLayout({ isEnabled })

  return <FeedbackLayoutView {...layout}>{children}</FeedbackLayoutView>
}
