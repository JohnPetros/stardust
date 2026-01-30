import type { Period } from '#global/domain/structures/Period'
import type { Text } from '#global/domain/structures/Text'

export type FeedbackReportsListingParams = {
  authorName?: Text
  intent?: Text
  sentAtPeriod?: Period
}
