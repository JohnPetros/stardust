import type { ManyItems } from '../../global/domain/types'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'
import type { FeedbackReportsListingParams } from '../domain/types'

export interface FeedbackReportsRepository {
  add(report: FeedbackReport): Promise<void>
  findMany(params: FeedbackReportsListingParams): Promise<ManyItems<FeedbackReport>>
}
