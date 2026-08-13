import type { FeedbackConversationDraft } from '@/ui/reporting/types'

type Params = {
  draft: FeedbackConversationDraft
  onChange: (draft: FeedbackConversationDraft) => void
  isLoading: boolean
}

export function useFeedbackMessageComposer({ draft, onChange, isLoading }: Params) {
  const canSubmit =
    draft.content.trim().length > 0 && draft.content.trim().length <= 2000 && !isLoading

  function handleContentChange(content: string) {
    onChange({ ...draft, content })
  }

  function handleAttachmentsChange(
    attachments: FeedbackConversationDraft['attachments'],
  ) {
    onChange({ ...draft, attachments })
  }

  return { canSubmit, handleContentChange, handleAttachmentsChange }
}
