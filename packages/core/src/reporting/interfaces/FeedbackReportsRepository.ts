import type { FeedbackReport } from '../domain/entities/FeedbackReport'

export interface FeedbackReportsRepository {
  add(report: FeedbackReport): Promise<void>
}
