import { FeedbackAttachmentsInputView } from './FeedbackAttachmentsInputView'
import { useFeedbackAttachmentsInput } from './useFeedbackAttachmentsInput'
import type { FeedbackDraftAttachment } from '@/ui/reporting/types'

type Props = {
  attachments: FeedbackDraftAttachment[]
  max: number
  onChange: (attachments: FeedbackDraftAttachment[]) => void
  disabled?: boolean
  label?: string
}

export function FeedbackAttachmentsInput(props: Props) {
  const { handleInputChange, remove } = useFeedbackAttachmentsInput(props)
  return (
    <FeedbackAttachmentsInputView
      {...props}
      onInputChange={handleInputChange}
      onRemove={remove}
    />
  )
}
