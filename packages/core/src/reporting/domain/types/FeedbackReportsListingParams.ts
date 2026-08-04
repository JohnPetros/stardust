import type { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { Period } from '#global/domain/structures/Period'
import type { Text } from '#global/domain/structures/Text'
import type { FeedbackIntent } from '../structures/FeedbackIntent'
import type { FeedbackReportStatus } from '../structures/FeedbackReportStatus'

export type FeedbackReportsListingParams = {
  search?: Text
  status?: FeedbackReportStatus
  createdAtPeriod?: Period
  authorName?: Text
  intent?: FeedbackIntent
  sentAtPeriod?: Period
  page?: OrdinalNumber
  itemsPerPage?: OrdinalNumber
}
