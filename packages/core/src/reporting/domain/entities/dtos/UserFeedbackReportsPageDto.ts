import type { FeedbackReportDto } from './FeedbackReportDto'

export type UserFeedbackReportsPageDto = {
  items: FeedbackReportDto[]
  page: number
  itemsPerPage: number
  total: number
}
