import type { ManyItems } from '../../global/domain/types'
import type { Id } from '../../global/domain/structures/Id'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'
import type { FeedbackReportsListingParams } from '../domain/types'

export interface FeedbackReportsRepository {
  add(report: FeedbackReport): Promise<void>
  findById(feedbackId: Id): Promise<FeedbackReport | null>
  findMany(params: FeedbackReportsListingParams): Promise<ManyItems<FeedbackReport>>
  remove(feedbackId: Id): Promise<void>
}
