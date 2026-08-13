import { FeedbackLayoutClient } from './FeedbackLayoutClient'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function FeedbackLayout({ children }: Props) {
  return <FeedbackLayoutClient>{children}</FeedbackLayoutClient>
}
