import type { PropsWithChildren } from 'react'

import { FeedbackDialog } from './FeedbackDialog'

export const FeedbackLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <FeedbackDialog />
    </>
  )
}
