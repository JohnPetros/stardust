import { FeedbackUnreadBadgeView } from './FeedbackUnreadBadgeView'

import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof FeedbackUnreadBadgeView>

export function FeedbackUnreadBadge(props: Props) {
  return <FeedbackUnreadBadgeView {...props} />
}
