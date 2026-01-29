import type { PropsWithChildren } from 'react'
import { FeedbackDialog } from './FeedbackDialog'

export const FeedbackLayoutView = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <FeedbackDialog />
    </>
  )
}
