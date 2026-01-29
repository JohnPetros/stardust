'use client'

import { useFeedbackDialog } from './useFeedbackDialog'
import { FeedbackDialogView } from './FeedbackDialogView'

export const FeedbackDialog = () => {
  const logic = useFeedbackDialog()

  return <FeedbackDialogView {...logic} />
}
