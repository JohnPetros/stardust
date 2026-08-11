import type { FeedbackReportDetailsDto } from '@stardust/core/reporting/entities/dtos'

import { FeedbackReportConversationView } from './FeedbackReportConversationView'
import { useFeedbackReportConversation } from './useFeedbackReportConversation'

type Props = { detail: FeedbackReportDetailsDto; cdnUrl?: string }

export function FeedbackReportConversation({ detail, cdnUrl }: Props) {
  const { messages, authorAvatar } = useFeedbackReportConversation({ detail, cdnUrl })
  return (
    <FeedbackReportConversationView messages={messages} authorAvatar={authorAvatar} />
  )
}
