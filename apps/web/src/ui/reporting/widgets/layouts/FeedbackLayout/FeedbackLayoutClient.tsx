'use client'

import { FeedbackLayoutView } from './FeedbackLayoutView'
import { useFeedbackLayout } from './useFeedbackLayout'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function FeedbackLayoutClient({ children }: Props) {
  const layout = useFeedbackLayout()

  return <FeedbackLayoutView {...layout}>{children}</FeedbackLayoutView>
}
