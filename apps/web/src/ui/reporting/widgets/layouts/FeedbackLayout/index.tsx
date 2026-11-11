import { FeedbackLayoutClient } from './FeedbackLayoutClient'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  isEnabled?: boolean
}

export function FeedbackLayout({ children, isEnabled = true }: Props) {
  return <FeedbackLayoutClient isEnabled={isEnabled}>{children}</FeedbackLayoutClient>
}
