'use client'

import type { ReactNode } from 'react'

import { FeedbackDialog } from './FeedbackDialog'

type Props = {
  children: ReactNode
  classNames: { container: string; content: string }
  isDialogVisible: boolean
}

// The wrapper elements are always rendered so the page keeps its position in the
// React tree when the account appears (e.g. right after sign-in). When the layout is
// disabled they use `display: contents` and do not affect the page layout.
export function FeedbackLayoutView({ children, classNames, isDialogVisible }: Props) {
  return (
    <div className={classNames.container}>
      <div className={classNames.content}>{children}</div>
      {isDialogVisible && <FeedbackDialog />}
    </div>
  )
}
