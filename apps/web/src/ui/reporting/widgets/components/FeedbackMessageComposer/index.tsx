import { FeedbackMessageComposerView } from './FeedbackMessageComposerView'
import { useFeedbackMessageComposer } from './useFeedbackMessageComposer'
import type { FeedbackConversationDraft } from '@/ui/reporting/types'

type Props = {
  draft: FeedbackConversationDraft
  onChange: (draft: FeedbackConversationDraft) => void
  onSubmit: () => void
  isLoading: boolean
  isClosed: boolean
}

export function FeedbackMessageComposer({ onChange, ...props }: Props) {
  const { canSubmit, handleContentChange, handleAttachmentsChange } =
    useFeedbackMessageComposer({
      draft: props.draft,
      onChange,
      isLoading: props.isLoading,
    })

  return (
    <FeedbackMessageComposerView
      {...props}
      canSubmit={canSubmit}
      onContentChange={handleContentChange}
      onAttachmentsChange={handleAttachmentsChange}
    />
  )
}
